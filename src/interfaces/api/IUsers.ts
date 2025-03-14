import { User, UserLookupOptions } from 'types/user';

/**
 * Interface for the Users module.
 * Provides methods for interacting with users on Twitter.
 */
export interface IUsers {
  /**
   * Retrieves a user by ID.
   *
   * @param id - The ID of the user to retrieve
   * @param options - Optional parameters for the user lookup
   * @returns A promise that resolves to the user
   */
  getUserById(id: string, options?: UserLookupOptions): Promise<User>;

  /**
   * Retrieves a user by username.
   *
   * @param username - The username of the user to retrieve
   * @param options - Optional parameters for the user lookup
   * @returns A promise that resolves to the user
   */
  getUserByUsername(username: string, options?: UserLookupOptions): Promise<User>;

  /**
   * Retrieves multiple users by their IDs.
   *
   * @param ids - The IDs of the users to retrieve
   * @param options - Optional parameters for the user lookup
   * @returns A promise that resolves to an array of users
   */
  getUsersByIds(ids: string[], options?: UserLookupOptions): Promise<User[]>;

  /**
   * Retrieves multiple users by their usernames.
   *
   * @param usernames - The usernames of the users to retrieve
   * @param options - Optional parameters for the user lookup
   * @returns A promise that resolves to an array of users
   */
  getUsersByUsernames(usernames: string[], options?: UserLookupOptions): Promise<User[]>;

  /**
   * Follows a user.
   *
   * @param userId - The ID of the user to follow
   * @returns A promise that resolves when the user is followed
   */
  followUser(userId: string): Promise<void>;

  /**
   * Unfollows a user.
   *
   * @param userId - The ID of the user to unfollow
   * @returns A promise that resolves when the user is unfollowed
   */
  unfollowUser(userId: string): Promise<void>;

  /**
   * Blocks a user.
   *
   * @param userId - The ID of the user to block
   * @returns A promise that resolves when the user is blocked
   */
  blockUser(userId: string): Promise<void>;

  /**
   * Unblocks a user.
   *
   * @param userId - The ID of the user to unblock
   * @returns A promise that resolves when the user is unblocked
   */
  unblockUser(userId: string): Promise<void>;

  /**
   * Mutes a user.
   *
   * @param userId - The ID of the user to mute
   * @returns A promise that resolves when the user is muted
   */
  muteUser(userId: string): Promise<void>;

  /**
   * Unmutes a user.
   *
   * @param userId - The ID of the user to unmute
   * @returns A promise that resolves when the user is unmuted
   */
  unmuteUser(userId: string): Promise<void>;
}
