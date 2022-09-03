import { UploadApiConfig, UserDataService } from '@ricklove/user-data-service';
import { AppError, delay } from '@ricklove/utils-core';

const createStorageAccess = <T>(storageName: string) => {
  return {
    get: () => {
      const v = localStorage.getItem(storageName);
      if (!v) {
        return undefined;
      }
      return JSON.parse(v) as T;
    },
    set: (value: T) => {
      localStorage.setItem(storageName, JSON.stringify(value));
    },
  };
};

export type UserProgressConfig = UploadApiConfig;
export type UserProgressService<T> = {
  getUserData: () => T | undefined;
  setUserData: (value: T) => void;
  saveUserProgress: () => Promise<void>;
  loadUserProgress: () => Promise<void>;
  createShareCode: (args?: { temporaryShareCode?: boolean }) => Promise<{ shareCode: string }>;
  loadShareCode: (args: { shareCode: string }) => Promise<void>;
};
export const createUserProgressService = <T>(
  config: UserProgressConfig,
  options: { storageName: string },
): UserProgressService<T> => {
  let isSetup = false;
  let isRunningSetup = false;

  const doSetup = async () => {
    // eslint-disable-next-line no-unmodified-loop-condition
    while (isRunningSetup) {
      await delay(10);
    }
    if (isSetup) {
      return;
    }

    isRunningSetup = true;
    try {
      UserDataService.setup(config);
      const service = UserDataService.get();
      await service.setup(`AnonymousUser`);
      const user = service.getActiveUser();
      if (!user) {
        throw new AppError(`Unable to create user access`);
      }
    } finally {
      // eslint-disable-next-line require-atomic-updates
      isSetup = true;
      // eslint-disable-next-line require-atomic-updates
      isRunningSetup = false;
    }
  };

  const storageAccess = createStorageAccess<T>(options.storageName);
  return {
    getUserData: storageAccess.get,
    setUserData: storageAccess.set,
    saveUserProgress: async () => {
      await doSetup();
      await UserDataService.get().uploadUserData();
    },
    loadUserProgress: async () => {
      await doSetup();
      await UserDataService.get().downloadUserDataIfNewer();
    },
    createShareCode: async ({ temporaryShareCode = true }: { temporaryShareCode?: boolean } = {}) => {
      await doSetup();
      return await UserDataService.get().createShareCode(UserDataService.get().getActiveUser()!.key, {
        temporaryShareCode,
      });
    },
    loadShareCode: async ({ shareCode }: { shareCode: string }) => {
      await doSetup();
      const addedUserProfile = await UserDataService.get().addUserFromShareCode(shareCode);
      await UserDataService.get().setActiveUser(addedUserProfile.key);
    },
  };
};
