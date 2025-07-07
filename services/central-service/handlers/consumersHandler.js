import { consume } from '../../../shared/config/rabbitmq.js';

import CategoryService from '../services/CategoryService.js';
import ProductService from '../services/ProductService.js';
import StockService from '../services/StockService.js';
import StockHistoryService from '../services/StockHistoryService.js';
import StoreService from '../services/StoreService.js';
import TransferService from '../services/TransferService.js';

export default async () => {
  console.log('Starting RabbitMQ consumers...');

  /**
   * Transfer Consumers
  **/
  await consume('transfer.create', async (data) => {
    try {
      console.log('[transfer.create] Received message:', data);

      await TransferService.createTransfer(data);

      console.log('[transfer.create] Transfer created successfully:', data);
    } catch (error) {
      console.error('[transfer.create] Error processing message:', error);
    }
  });

  await consume('transfer.update', async (data) => {
    try {
      console.log('[transfer.update] Received message:', data);

      await TransferService.updateTransferById(data);

      console.log('[transfer.update] Transfer updated successfully:', data);
    } catch (error) {
      console.error('[transfer.update] Error processing message:', error);
    }
  });

  await consume('transfer.delete', async (data) => {
    try {
      console.log('[transfer.delete] Received message:', data);

      await TransferService.deleteTransferById(data);

      console.log('[transfer.delete] Transfer deleted successfully:', data);
    } catch (error) {
      console.error('[transfer.delete] Error processing message:', error);
    }
  });

  /**
   * Stock History Consumers
  **/
  await consume('stockHistory.create', async (data) => {
    try {
      console.log('[stockHistory.create] Received message:', data);

      await StockHistoryService.createHistory(data);

      console.log('[stockHistory.create] Stock history created successfully:', data);
    } catch (error) {
      console.error('[stockHistory.create] Error processing message:', error);
    }
  });

  await consume('stockHistory.update', async (data) => {
    try {
      console.log('[stockHistory.update] Received message:', data);

      await StockHistoryService.updateHistoryById(data);

      console.log('[stockHistory.update] Stock history updated successfully:', data);
    } catch (error) {
      console.error('[stockHistory.update] Error processing message:', error);
    }
  });

  await consume('stockHistory.delete', async (data) => {
    try {
      console.log('[stockHistory.delete] Received message:', data);

      await StockHistoryService.deleteHistoryById(data);

      console.log('[stockHistory.delete] Stock history deleted successfully:', data);
    } catch (error) {
      console.error('[stockHistory.delete] Error processing message:', error);
    }
  });

  /**
   * Stock Consumers
  **/
  await consume('stock.create', async (data) => {
    try {
      console.log('[stock.create] Received message:', data);

      await StockService.createStock(data);

      console.log('[stock.create] Stock created successfully:', data);
    } catch (error) {
      console.error('[stock.create] Error processing message:', error);
    }
  });

  await consume('stock.update', async (data) => {
    try {
      console.log('[stock.update] Received message:', data);

      await StockService.updateStockById(data);

      console.log('[stock.update] Stock updated successfully:', data);
    } catch (error) {
      console.error('[stock.update] Error processing message:', error);
    }
  });

  await consume('stock.delete', async (data) => {
    try {
      console.log('[stock.delete] Received message:', data);

      await StockService.deleteStockById(data);

      console.log('[stock.delete] Stock deleted successfully:', data);
    } catch (error) {
      console.error('[stock.delete] Error processing message:', error);
    }
  });

  /**
   * Sotre Consumers
  **/
  await consume('store.create', async (data) => {
    try {
      console.log('[store.create] Received message:', data);

      await StoreService.createStore(data);

      console.log('[store.create] Store created successfully:', data);
    } catch (error) {
      console.error('[store.create] Error processing message:', error);
    }
  });

  await consume('store.update', async (data) => {
    try {
      console.log('[store.update] Received message:', data);

      await StoreService.updateStoreById(data);

      console.log('[store.update] Store updated successfully:', data);
    } catch (error) {
      console.error('[store.update] Error processing message:', error);
    }
  });

  await consume('store.delete', async (data) => {
    try {
      console.log('[store.delete] Received message:', data);

      await StoreService.deleteStoreById(data);

      console.log('[store.delete] Store deleted successfully:', data);
    } catch (error) {
      console.error('[store.delete] Error processing message:', error);
    }
  });

  /**
   * Product Consumers
  **/
  await consume('product.create', async (data) => {
    try {
      console.log('[product.create] Received message:', data);

      await ProductService.createProduct(data);

      console.log('[product.create] Product created successfully:', data);
    } catch (error) {
      console.error('[product.create] Error processing message:', error);
    }
  });

  await consume('product.update', async (data) => {
    try {
      console.log('[product.update] Received message:', data);

      await ProductService.updateProductById(data);

      console.log('[product.update] Product updated successfully:', data);
    } catch (error) {
      console.error('[product.update] Error processing message:', error);
    }
  });

  await consume('product.delete', async (data) => {
    try {
      console.log('[product.delete] Received message:', data);

      await ProductService.deleteProductById(data);

      console.log('[product.delete] Product deleted successfully:', data);
    } catch (error) {
      console.error('[product.delete] Error processing message:', error);
    }
  });

  /**
   * Category Consumers
  **/
  await consume('category.create', async (data) => {
    try {
      console.log('[category.create] Received message:', data);

      await CategoryService.createCategory(data);

      console.log('[category.create] Category created successfully:', data);
    } catch (error) {
      console.error('[category.create] Error processing message:', error);
    }
  });

  await consume('category.update', async (data) => {
    try {
      console.log('[category.update] Received message:', data);

      await CategoryService.updateCategoryById(data);

      console.log('[category.update] Category updated successfully:', data);
    } catch (error) {
      console.error('[category.update] Error processing message:', error);
    }
  });

  await consume('category.delete', async (data) => {
    try {
      console.log('[category.delete] Received message:', data);

      await CategoryService.deleteCategoryById(data);

      console.log('[category.delete] Category deleted successfully:', data);
    } catch (error) {
      console.error('[category.delete] Error processing message:', error);
    }
  });
}
