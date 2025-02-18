'use strict';

{
	const PLUGIN_CLASS = SDK.Plugins.LysdenArt_MaplyLitePlugin;

	PLUGIN_CLASS.Type = class MaplyLitePluginType extends SDK.ITypeBase {
		constructor (sdkPlugin, iObjectType) {
			super(sdkPlugin, iObjectType);
		}
	};
}
