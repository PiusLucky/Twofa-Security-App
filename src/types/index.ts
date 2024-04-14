export interface ICreateUserResponse {
  response: {
    meta: Meta;
    data: CreateUserResponseData;
  };
}

export interface ILoginUserResponse {
  response: {
    meta: Meta;
    data: LoginUserResponseData;
  };
}

export interface ITwoFaResponse {
  response: {
    meta: Meta;
    data: ITwoFa;
  };
}

export interface IRecoveryCodeStatusCheckResponse {
  response: {
    meta: Meta;
    data: boolean;
  };
}

export interface IUserProfileResponse {
  response: {
    meta: Meta;
    data: IUserProfileResponseData;
  };
}

export interface IUsersListingResponse {
  response: {
    meta: Meta;
    data: IUserProfileResponseData[];
  };
}

export interface IUserProfileResponseData {
  id: number;
  email: string;
  full_name: string;
  created_at: Date;
  updated_at: Date;
}

interface LoginUserResponseData {
  userId: string;
  token: string;
}

interface CreateUserResponseData {
  id: number;
  email: string;
  full_name: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

interface Meta {
  success: boolean;
  message: string;
}

export type CreateUserParams = {
  full_name: string;
  email: string;
  password: string;
};

export type UpdateUserParams = {
  full_name: string;
  email: string;
  suspended: string;
};

export interface IRecoveryCode {
  _id?: string;
  userId?: string;
  code?: string;
  active?: boolean;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITwoFa {
  _id?: string;
  userId?: string;
  secret?: string;
  status?: boolean;
  __v?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRecoveryCodeResponse {
  response: {
    meta: Meta;
    data: IRecoveryCode;
  };
}
