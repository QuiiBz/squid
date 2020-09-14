declare module 'electron-acrylic-window' {

    import { BrowserWindow as EBrowserWindow, BrowserWindowConstructorOptions } from 'electron';

    class SBrowserWindow extends EBrowserWindow {

        constructor(options?: AcrylicBrowserWindowConstructorOptions);
    }

    /**
     * Set the vibrancy for the specified window.
     *
     * @param window - The window to set vibrancy
     * @param options - The desired options for the vibrancy
     */
    function setVibrancy(window: EBrowserWindow, options: AcrylicBrowserWindowConstructorOptions | null): void;

    /**
     * Allow modifying default BrowserWindowConstructorOptions
     * to change vibrancy to VibrancyOptions.
     */
    type SModify<T, R> = Omit<T, keyof R> & R;

    /**
     * The new options of the BrowserWindow with the VibrancyOptions.
     */
    type SAcrylicBrowserWindowConstructorOptions = Modify<BrowserWindowConstructorOptions, {

        /**
         * The vibrancy settings for the window. Can be
         * a VibrancyTheme or the VibrancyOptions object.
         */
        vibrancy?: VibrancyTheme | VibrancyOptions,
    }>;

    /**
     * The vibrancy object
     */
    interface VibrancyOptions {

        /**
         * If the vibrancy is enabled.
         */
        enabled: boolean;
        /**
         * The theme to use.
         */
        theme?: VibrancyTheme;
        /**
         * The effect to use.
         */
        effect?: VibrancyEffect;
        /**
         * If enabled, we use a custom window resize/move
         * handler for performance.
         */
        useCustomWindowRefreshMethod?: boolean;
        /**
         * Maximum value to refresh application screen
         * in seconds.
         */
        maximumRefreshRate?: number;
        /**
         * If true, acrylic effect will be disabled whe
         * window lost focus.
         */
        disableOnBlur?: boolean;
    }

    /**
     * The theme to apply to the vibrancy. Can be 'light',
     * 'dark', 'appearance-based' or a custom HEX color
     * with alpha.
     */
    type SVibrancyTheme = 'light' | 'dark' | 'appearance-based' | 0xFF;
    /**
     * The effect to apply. Can be 'acrylic' or 'blur'.
     */
    type SVibrancyEffect = 'acrylic' | 'blur';
}