'use strict';

{
	const PLUGIN_CLASS = SDK.Plugins.LysdenArt_MaplyLitePlugin;

	PLUGIN_CLASS.Instance = class MaplyLiteInstance extends SDK.IWorldInstanceBase {
		constructor (sdkType, inst) {
			super(sdkType, inst);
		}

		Release () {
		}

		OnCreate () {
			// Default to top-left origin
			this._inst.SetOrigin(.5, .5);
		}

		OnPlacedInLayout ()	{
			// Set default size
			this._inst.SetSize(500, 500);
		}

		_UpdateWebGLText (iRenderer, iLayoutView) {
			if (!this._webglText)	{
				this._webglText = iRenderer.CreateWebGLText();
				this._webglText.SetFontSize(20);
				this._webglText.SetTextureUpdateCallback(() => iLayoutView.Refresh());
				this._webglText.SetHorizontalAlignment('center');
				this._webglText.SetVerticalAlignment('center');
			}

			const textZoom = iLayoutView.GetZoomFactor();
			this._webglText.SetSize(this._inst.GetWidth(), this._inst.GetHeight(), textZoom);
			this._webglText.SetText("map.ly lite");
		}

		Draw (iRenderer, iDrawParams) {
			const iLayoutView = iDrawParams.GetLayoutView();
			this._UpdateWebGLText(iRenderer, iLayoutView);

			this._inst.ApplyBlendMode(iRenderer);
			iRenderer.SetColorFillMode();

			const quad = this._inst.GetQuad();

			iRenderer.SetColorRgba(.5, .5, .5, 1);

			iRenderer.Quad(quad);

			iRenderer.SetColorRgba(0, 0, 0, 1);
			iRenderer.LineQuad(quad);

			// Draw button text on top
			const texture = this._webglText.GetTexture();
			if (!texture) {
				return;		// not yet loaded WebGLText - just ignore and skip rendering text, it'll appear momentarily
			}

			iRenderer.SetTextureFillMode();
			iRenderer.SetTexture(texture);
			iRenderer.ResetColor();
			iRenderer.Quad3(quad, this._webglText.GetTexRect());
		}

		HasDoubleTapHandler () {
			return true;
		}

		OnDoubleTap () {
		}

		OnPropertyChanged (id, value) {
		}

		LoadC2Property (name, valueString) {
			return false;		// not handled
		}
	};
}
