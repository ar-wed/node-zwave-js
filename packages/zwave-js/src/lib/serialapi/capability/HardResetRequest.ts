import type { MessageOrCCLogEntry } from "@zwave-js/core";
import { MessagePriority } from "@zwave-js/core";
import type { CCEncodingContext, ZWaveHost } from "@zwave-js/host";
import {
	FunctionType,
	Message,
	type MessageDeserializationOptions,
	type MessageEncodingContext,
	type MessageOptions,
	MessageOrigin,
	MessageType,
	expectedCallback,
	gotDeserializationOptions,
	messageTypes,
	priority,
} from "@zwave-js/serial";

@messageTypes(MessageType.Request, FunctionType.HardReset)
@priority(MessagePriority.Controller)
export class HardResetRequestBase extends Message {
	public constructor(host: ZWaveHost, options?: MessageOptions) {
		if (gotDeserializationOptions(options)) {
			if (
				options.origin === MessageOrigin.Host
				&& (new.target as any) !== HardResetRequest
			) {
				return new HardResetRequest(host, options);
			} else if (
				options.origin !== MessageOrigin.Host
				&& (new.target as any) !== HardResetCallback
			) {
				return new HardResetCallback(host, options);
			}
		}
		super(host, options);
	}
}

@expectedCallback(FunctionType.HardReset)
export class HardResetRequest extends HardResetRequestBase {
	public serialize(ctx: MessageEncodingContext): Buffer {
		this.payload = Buffer.from([this.callbackId]);
		return super.serialize(ctx);
	}

	public toLogEntry(): MessageOrCCLogEntry {
		return {
			...super.toLogEntry(),
			message: {
				"callback id": this.callbackId,
			},
		};
	}
}

export class HardResetCallback extends HardResetRequestBase {
	public constructor(
		host: ZWaveHost,
		options: MessageDeserializationOptions,
	) {
		super(host, options);
		this.callbackId = this.payload[0];
	}

	public toLogEntry(): MessageOrCCLogEntry {
		return {
			...super.toLogEntry(),
			message: {
				"callback id": this.callbackId,
			},
		};
	}
}
