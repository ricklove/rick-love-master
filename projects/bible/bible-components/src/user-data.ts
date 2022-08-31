import { UploadApiConfig, UserDataService } from '@ricklove/user-data-service';
import { AppError, delay } from '@ricklove/utils-core';

export type UserProgressConfig = UploadApiConfig;
export type UserProgressService = ReturnType<typeof createUserProgressService>;
export const createUserProgressService = (config: UserProgressConfig) => {
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

  return {
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
