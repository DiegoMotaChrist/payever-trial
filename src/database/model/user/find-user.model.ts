export interface FindUserModel {
  readonly data: {
    readonly id: number;
    readonly email: string;
    readonly first_name: string;
    readonly last_name: string;
    readonly avatar: string;
  };
  readonly support: {
    readonly url: string;
    readonly text: string;
  };
}
