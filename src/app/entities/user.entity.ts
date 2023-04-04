import { Replace } from '../../helpers/Replace';

export interface UserEntityProps {
  name?: string | undefined;
  job?: string | undefined;
  createdAt?: Date;
  data?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  support?: {
    url: string;
    text: string;
  };
}

export class UserEntity {
  private _id: string | undefined;
  private props: UserEntityProps;

  constructor(
    props: Replace<UserEntityProps, { createdAt?: Date }>,
    id?: string,
  ) {
    this._id = id;
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public get id(): string | undefined {
    return this._id;
  }

  public set name(name: string | undefined) {
    this.props.name = name;
  }

  public get name(): string | undefined {
    return this.props.name;
  }

  public set job(job: string | undefined) {
    this.props.job = job;
  }

  public get job(): string | undefined {
    return this.props.job;
  }

  public get data(): any {
    return this.props.data;
  }

  public set data(data: any) {
    this.props.data = data;
  }

  public get support(): any {
    return this.props.support;
  }

  public set support(support: any) {
    this.props.support = support;
  }

  public get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
}
