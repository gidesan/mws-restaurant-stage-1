import idb from 'idb';

export class LocalDBHelper {

  static get IDB_NAME() {
    return 'rr-app';
  }

  static get IDB_RESTAURANTS() {
    return 'restaurants';
  }

  static get IDB_REVIEWS() {
    return 'reviews';
  }

  static getReview(id) {
    return LocalDBHelper
      .openIDB()
      .then(idb => {
        if (!idb) return Promise.resolve();

        const tx = idb.transaction(LocalDBHelper.IDB_REVIEWS, 'readonly');
        const store = tx.objectStore(LocalDBHelper.IDB_REVIEWS);
        return store.get(id);
      });
  }

  static storeReview(review, pending) {
    return LocalDBHelper
      .openIDB()
      .then(idb => {
        if (!idb) return Promise.resolve();

        const tx = idb.transaction(LocalDBHelper.IDB_REVIEWS, 'readwrite');
        const store = tx.objectStore(LocalDBHelper.IDB_REVIEWS);
        return store.put(Object.assign({}, review, { pending }));
      });
  }

  static enqueueReview(review) {
    return LocalDBHelper.storeReview(review, true);
  }

  static dequeueReview(review) {
    return LocalDBHelper.storeReview(review, false);
  }

  static openIDB() {
    return idb.open(LocalDBHelper.IDB_NAME, 1, (upgradeDb) => {
      upgradeDb.createObjectStore(LocalDBHelper.IDB_RESTAURANTS, {
        keyPath: 'id'
      });
      upgradeDb.createObjectStore(LocalDBHelper.IDB_REVIEWS, {
        keyPath: 'id',
        autoIncrement: true
      });
    });
  }
}
