import { AccountManager, ProviderAccount } from './accountManager';

export interface CatalogItem {
  id: string;
  title: string;
  type: 'movie' | 'series';
  provider: string;
  posterUrl: string;
  deepLinkUrl: string;
}

export class CatalogFetcher {
  /**
   * Aggregates watchable content across all active connected streaming services
   */
  static async fetchUnifiedCatalog(): Promise<CatalogItem[]> {
    const activeAccounts = AccountManager.getAccounts().filter(a => a.isActive);
    let unifiedCatalog: CatalogItem[] = [];

    for (const account of activeAccounts) {
      const providerItems = await this.fetchProviderItems(account);
      unifiedCatalog = unifiedCatalog.concat(providerItems);
    }

    return unifiedCatalog;
  }

  private static async fetchProviderItems(account: ProviderAccount): Promise<CatalogItem[]> {
    // In production, query TMDB or Watchmode API filtered by account.provider ID
    // Example formatted payload returned to client:
    return [
      {
        id: `${account.provider}-item-1`,
        title: `Sample ${account.provider.toUpperCase()} Title`,
        type: 'movie',
        provider: account.provider,
        posterUrl: 'https://via.placeholder.com/300x450',
        deepLinkUrl: `https://www.${account.provider}.com/watch/sample-id`
      }
    ];
  }
}
