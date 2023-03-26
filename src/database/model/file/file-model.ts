export interface FileModel extends Document {
  readonly user_id: string;
  readonly hash: string;
  readonly content: {
    readonly name: string;
    readonly mime_type: string;
    readonly size: number;
  };
}
