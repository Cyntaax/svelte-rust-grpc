/* eslint-disable */
import * as grpcweb from '@improbable-eng/grpc-web';
const grpc = grpcweb.grpc;
import { BrowserHeaders } from "browser-headers";
import * as _m0 from "protobufjs/minimal.js";

export const protobufPackage = "rpc";

export interface Normal {
  id: number;
}

export interface Blank {
  blank: boolean;
}

function createBaseNormal(): Normal {
  return { id: 0 };
}

export const Normal = {
  encode(message: Normal, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Normal {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNormal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.id = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Normal {
    return { id: isSet(object.id) ? globalThis.Number(object.id) : 0 };
  },

  toJSON(message: Normal): unknown {
    const obj: any = {};
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Normal>, I>>(base?: I): Normal {
    return Normal.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Normal>, I>>(object: I): Normal {
    const message = createBaseNormal();
    message.id = object.id ?? 0;
    return message;
  },
};

function createBaseBlank(): Blank {
  return { blank: false };
}

export const Blank = {
  encode(message: Blank, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.blank !== false) {
      writer.uint32(8).bool(message.blank);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Blank {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBlank();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.blank = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Blank {
    return { blank: isSet(object.blank) ? globalThis.Boolean(object.blank) : false };
  },

  toJSON(message: Blank): unknown {
    const obj: any = {};
    if (message.blank !== false) {
      obj.blank = message.blank;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Blank>, I>>(base?: I): Blank {
    return Blank.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Blank>, I>>(object: I): Blank {
    const message = createBaseBlank();
    message.blank = object.blank ?? false;
    return message;
  },
};

export interface Main {
  Test(request: DeepPartial<Normal>, metadata?: grpc.Metadata): Promise<Blank>;
}

export class MainClientImpl implements Main {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Test = this.Test.bind(this);
  }

  Test(request: DeepPartial<Normal>, metadata?: grpc.Metadata): Promise<Blank> {
    return this.rpc.unary(MainTestDesc, Normal.fromPartial(request), metadata);
  }
}

export const MainDesc = { serviceName: "rpc.Main" };

export const MainTestDesc: UnaryMethodDefinitionish = {
  methodName: "Test",
  service: MainDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return Normal.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      const value = Blank.decode(data);
      return {
        ...value,
        toObject() {
          return value;
        },
      };
    },
  } as any,
};

interface UnaryMethodDefinitionishR extends grpc.UnaryMethodDefinition<any, any> {
  requestStream: any;
  responseStream: any;
}

type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;

interface Rpc {
  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    request: any,
    metadata: grpc.Metadata | undefined,
  ): Promise<any>;
}

export class GrpcWebImpl {
  private host: string;
  private options: {
    transport?: grpc.TransportFactory;

    debug?: boolean;
    metadata?: grpc.Metadata;
    upStreamRetryCodes?: number[];
  };

  constructor(
    host: string,
    options: {
      transport?: grpc.TransportFactory;

      debug?: boolean;
      metadata?: grpc.Metadata;
      upStreamRetryCodes?: number[];
    },
  ) {
    this.host = host;
    this.options = options;
  }

  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined,
  ): Promise<any> {
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata = metadata && this.options.metadata
      ? new BrowserHeaders({ ...this.options?.metadata.headersMap, ...metadata?.headersMap })
      : metadata ?? this.options.metadata;
    return new Promise((resolve, reject) => {
      grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: maybeCombinedMetadata ?? {},
        ...(this.options.transport !== undefined ? { transport: this.options.transport } : {}),
        debug: this.options.debug ?? false,
        onEnd: function (response) {
          if (response.status === grpc.Code.OK) {
            resolve(response.message!.toObject());
          } else {
            const err = new GrpcWebError(response.statusMessage, response.status, response.trailers);
            reject(err);
          }
        },
      });
    });
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export class GrpcWebError extends globalThis.Error {
  constructor(message: string, public code: grpc.Code, public metadata: grpc.Metadata) {
    super(message);
  }
}
