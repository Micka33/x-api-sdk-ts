export interface GetUploadStatusQuery {
  /**
   * The media ID of the targeted media to APPEND.
   * @example "1146654567674912769"
   */
  media_id: string;
  /**
   * The type of command, must be 'STATUS'.
   * @example "STATUS"
   */
  command: 'STATUS';
}
