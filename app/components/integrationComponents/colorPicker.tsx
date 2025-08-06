import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useAtom } from "jotai";
import { integrationStatePropertyAtomFamily } from "../../atoms/integrationState";
import { useOrchestrator } from "../../orchestrator/interface";
import { ColorPicker as IroColorPicker } from "react-iro";
import iro from "@jaames/iro";
import { rgbToHex, rgbToHsv, hsvToRgb, isHsv, isRgb } from "~/utils/colorUtils";
import type { RgbColor, HsvColor } from "~/utils/colorUtils";

// Define interface for the iro.js Color object
interface IroColor {
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  hsv: {
    h: number;
    s: number;
    v: number;
  };
  hex: string;
  hsl: {
    h: number;
    s: number;
    l: number;
  };
  index?: number;
  set: (value: any) => void;
  clone: () => IroColor;
}

type StateColor = HsvColor | RgbColor | null;

interface ColorPickerProps {
  integrationId: string;
  property: string;
  command: string;
  evaluator: (state: any) => StateColor;
  width?: number;
  height?: number;
}

export const ColorPicker = React.memo(
  ({
    integrationId,
    property = "/lightState",
    command = "/color",
    evaluator,
    width = 200,
    height = 200,
  }: ColorPickerProps) => {
    // }, [integrationId]);

    // Memoize the atom parameters
    const atomParam = useMemo(() => {
      console.log(`[ColorPicker ${integrationId}] creating atom params`);
      return { id: integrationId, property };
    }, [integrationId, property]);

    // Get state from atom
    const [state] = useAtom(integrationStatePropertyAtomFamily(atomParam));
    const orchestrator = useOrchestrator();

    // For temporary local state while picking
    const [localColor, setLocalColor] = useState<StateColor>(null);

    // Memoize the evaluation result
    const color = useMemo(() => {
      console.log(`[ColorPicker ${integrationId}] evaluating state:`, state);
      if (state === null || state === undefined) {
        return null;
      }
      try {
        return evaluator(state);
      } catch (e) {
        console.error(`[ColorPicker ${integrationId}] evaluation error:`, e);
        return null;
      }
    }, [integrationId, state, evaluator]);

    // Sync remote color to local state when remote changes
    useEffect(() => {
      if (color !== null && localColor === null) {
        if (isRgb(color)) {
          setLocalColor(color);
        } else if (isHsv(color)) {
          setLocalColor(hsvToRgb(color));
        }
      }
    }, [color]);

    // Handle color change (during active picking)
    const handleColorChange = useCallback((color: IroColor) => {
      // Update local state immediately for smooth UI
      setLocalColor({
        r: Math.round(color.rgb.r),
        g: Math.round(color.rgb.g),
        b: Math.round(color.rgb.b),
      });
    }, []);

    // Send color to device when color picking ends
    const handleColorChangeComplete = useCallback(
      (color: IroColor) => {
        const rgbColor: RgbColor = {
          r: Math.round(color.rgb.r),
          g: Math.round(color.rgb.g),
          b: Math.round(color.rgb.b),
        };
        console.log(`[ColorPicker ${integrationId}] sending color:`, rgbColor);
        orchestrator.callCommand(integrationId, command, rgbColor);
      },
      [integrationId, orchestrator, command]
    );

    // If state is invalid, show error state
    if (color === null && localColor === null) {
      return (
        <div className="integration-card">
          <div className="text-error">Integration not found</div>
        </div>
      );
    }

    // Use local color for display if available, fall back to remote color
    // Ensure we always have an RGB color for display
    const displayColor = useMemo(() => {
      if (localColor && isRgb(localColor)) {
        return localColor;
      } else if (color) {
        return isHsv(color) ? hsvToRgb(color) : color;
      }
      return null;
    }, [localColor, color]);

    // Only apply color style if we have valid RGB values
    const colorStyle =
      displayColor && isRgb(displayColor)
        ? {
            backgroundColor: `rgb(${displayColor.r}, ${displayColor.g}, ${displayColor.b})`,
          }
        : {};

    // Use the imported rgbToHex function only with RGB colors
    const hexColor =
      displayColor && isRgb(displayColor) ? rgbToHex(displayColor) : "#ffffff";

    // Render the color picker
    return (
      <div
        id={`color-picker-integration-${integrationId}`}
        className="integration-color-picker"
      >
        <div className="mb-2 text-center">
          <div className="color-preview" style={colorStyle}></div>
          <div className="text-sm mt-1">
            RGB:{" "}
            {displayColor && isRgb(displayColor)
              ? `${displayColor.r}, ${displayColor.g}, ${displayColor.b}`
              : "Unknown"}
          </div>
        </div>

        <IroColorPicker
          options={
            {
              color: hexColor,
              width: width,
              height: height,
              layout: [
                {
                  component: "wheel",
                  options: {},
                },
              ],
              wheelLightness: false,
              wheelAngle: 0,
              wheelDirection: "anticlockwise",
            } as any
          }
          setters={
            {
              color: {
                change: handleColorChangeComplete,
                init: handleColorChange,
              },
              input: {
                start: handleColorChange,
                move: handleColorChange,
                end: handleColorChangeComplete,
              },
            } as any
          }
        />
      </div>
    );
  }
);

// Add display name for debugging
ColorPicker.displayName = "ColorPicker";
