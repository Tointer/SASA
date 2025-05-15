/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { graphql } from '@mysten/sui/graphql/schemas/latest';

// ─────────────────────────────────────────────────────────────────────────
// 1 . Extra helper type fixes the "parsedJson is unknown" complaint
// ─────────────────────────────────────────────────────────────────────────
interface CoinBalanceChangeEvent {
    type: string;
    parsedJson: {
      owner:    string;
      coinType: string;
      amount:   string;   // still a string on the wire
    };
  }

  type Transfer = {
    owner: string;
    coinType: string;
    amount: bigint;
};

  function extractTransfers(resp: {
    events?: unknown[];
    balanceChanges?: {
      owner: { AddressOwner?: string; ObjectOwner?: string; Shared?: string };
      coinType: string;
      amount: string;
    }[];
  }): Transfer[] {
    const transfers: Transfer[] = [];
  
    // 1. From events (CoinBalanceChange)
    const eventTransfers = (resp.events ?? [])
      .filter((ev: any): ev is {
        type: string;
        parsedJson: { owner: string; coinType: string; amount: string };
      } =>
        ev?.type?.includes('CoinBalanceChange') &&
        typeof ev.parsedJson?.owner === 'string' &&
        typeof ev.parsedJson?.coinType === 'string' &&
        typeof ev.parsedJson?.amount === 'string'
      )
      .map((ev) => ({
        owner: ev.parsedJson.owner,
        coinType: ev.parsedJson.coinType,
        amount: BigInt(ev.parsedJson.amount),
      }));
  
    transfers.push(...eventTransfers);
  
    // console.log(JSON.stringify(resp));
    // 2. From balanceChanges array
    const balanceTransfers = (resp.balanceChanges ?? [])
      .filter(
        (b) =>
          typeof b.amount === 'string' &&
          typeof b.coinType === 'string' &&
          b.owner &&
          (b.owner.AddressOwner || b.owner.ObjectOwner || b.owner.Shared)
      )
      .map((b) => ({
        owner:
          b.owner.AddressOwner ??
          b.owner.ObjectOwner ??
          b.owner.Shared ??
          'unknown',
        coinType: b.coinType,
        amount: BigInt(b.amount),
      }));
  
    transfers.push(...balanceTransfers);
  
    return transfers;
  }
  

interface OnchainAnalysis {
  status: string;
  touchedContracts: {
    id: string;
    isNew: boolean;
  }[];
  balanceChanges: Transfer[];
  riskFlags: string[];
}

export async function getOnchainInfo(): Promise<OnchainAnalysis> {
    console.log("getOnchainInfo called");
    const digest = '2GAzgwe1yvYxw2CQTEPaCdDHuv8MoXEZPYMCKqk6cxZJ'; // demo

    const client = new SuiClient({ url: getFullnodeUrl('mainnet') });
    const gql = new SuiGraphQLClient({
        url: 'https://sui-mainnet.mystenlabs.com/graphql',
    });

    const resp = await client.getTransactionBlock({
        digest,
        options: {
        showInput: true,
        showEffects: true,
        showEvents: true,
        showBalanceChanges: true,
        showObjectChanges: false,
        },
    });

    if (!resp.transaction) {
        console.error('No such transaction on chain.');
        return {
            status: 'Not Found',
            touchedContracts: [],
            balanceChanges: [],
            riskFlags: ['Transaction not found']
        };
    }

    const txData = resp.transaction.data!;
    const commands = (txData.transaction as any).transactions;

    /* contracts touched -------------------------------------------------- */
    const touched = new Set<string>();
    for (const cmd of commands) {
        if ('MoveCall' in cmd) touched.add(cmd.MoveCall.package);
    }

    const transfers = extractTransfers(resp as any);
    for (const t of transfers) {
        const dir = t.amount > 0n ? '+' : '';
        console.log(`  • ${dir}${t.amount}  ${t.coinType}  → ${t.owner}`);
    }

    /* package-age check -------------------------------------------------- */
    const nowMs = Date.now();
    const youngPkgs: string[] = [];

    const pkgAgeQuery = graphql(/* GraphQL */ `
        query pkg($id: SuiAddress!) {
        packageVersions(address: $id, first: 1) {
            nodes {
            creationCheckpointNumber
            }
        }
        }
    `);

    const checkpointQuery = graphql(/* GraphQL */ `
        query ck($seq: UInt53!) {
        checkpoint(sequenceNumber: $seq) {
            timestamp
        }
        }
    `);

    for (const pkg of touched) {
        try {
            const v = await gql.query({
                query: pkgAgeQuery,
                variables: { id: pkg },
            });

            const chkNum =
                v.data?.packageVersions.nodes[0]?.creationCheckpointNumber;
            if (!chkNum) continue;

            const ck = await gql.query({
                query: checkpointQuery,
                variables: { seq: chkNum },
            });

            const ts = Number(ck.data?.checkpoint!.timestamp);
            const ageDays = (nowMs - ts) / 86_400_000; // ms → days

            if (ageDays < 7) youngPkgs.push(pkg);
        } catch {
            /* network or empty-field errors ignored */
        }
    }

    /* report ------------------------------------------------------------- */
    console.log(`\n=== Transaction ${digest} ===`);
    console.log(`Status : ${resp.effects?.status.status}`);

    console.log('\nContracts touched:');
    for (const id of touched) {
        console.log(
            `  • ${id}${youngPkgs.includes(id) ? '  (NEW < 7 d!)' : ''}`,
        );
    }

    console.log('\nToken balance changes:');
    if (transfers.length === 0) {
        console.log('  – none –');
    } else {
        for (const t of transfers) {
            const dir = t.amount > 0n ? '+' : '';
            console.log(`  • ${dir}${t.amount}  ${t.coinType}  → ${t.owner}`);
        }
    }

    console.log('\nRisk flags:');
    if (youngPkgs.length) {
        console.log(
            `  ⚠ Package(s) published < 7 days ago: ${youngPkgs.join(', ')}`,
        );
    } else {
        console.log('  – none –');
    }

    // Return the analysis results
    const riskFlags: string[] = [];
    if (youngPkgs.length) {
        riskFlags.push(`Package(s) published < 7 days ago: ${youngPkgs.join(', ')}`);
    }

    return {
        status: resp.effects?.status.status || 'Unknown',
        touchedContracts: Array.from(touched).map(id => ({
            id,
            isNew: youngPkgs.includes(id)
        })),
        balanceChanges: transfers,
        riskFlags
    };
}

export default { getOnchainInfo };
