
export const basicThemeColors = {
    text: `#333333`,
    text_button: `#333333`,
    text_error: `#333333`,
    border: `#cccccc`,
    background: `#ffffff`,
    background_field: `#dddddd`,
    background_button: `#eeeeee`,
    background_error: `#ffcccc`,
    loader: `#3333ff`,
};

export const basicThemeSizes = {
    textPadding: 4,
    borderWidth: 1,
    borderRadius: 4,
    sectionGap: 16,
    elementGap: 8,
    rowGap: 4,
    rowPadding: 4,

    fontSize: 14,
    fontSize_input: 16,
    fontSize_button: 14,
    fontSize_header: 20,
};

export const basicFont = {
    fontFamily: `"Trebuchet MS", Helvetica, Roboto, sans-serif`,
    fontWeight_normal: `normal` as 'normal' | 'bold',
    fontWeight_button: `bold` as 'normal' | 'bold',
    fontWeight_header: `bold` as 'normal' | 'bold',
};

export type ThemeColors = typeof basicThemeColors;
export type ThemeSizes = typeof basicThemeSizes;
export type ThemeFont = typeof basicFont;

const createTheme = (colors: ThemeColors, sizes: ThemeSizes, font: ThemeFont) => {

    const borderProps = {
        borderWidth: sizes.borderWidth,
        borderRadius: sizes.borderRadius,
        borderColor: colors.border,
        borderStyle: `solid`,
    } as const;

    return {
        colors,
        sizes,
        font,

        div_form: {
            ...borderProps,
            marginBottom: sizes.sectionGap,
            padding: 8,
        },
        span_formTitle: {
            padding: sizes.textPadding,
            color: colors.text,
            fontSize: sizes.fontSize_header,
            fontFamily: font.fontFamily,
            fontWeight: font.fontWeight_header,
        },
        div_fieldRow: {
            ...borderProps,
            marginBottom: sizes.rowGap,
            padding: sizes.rowPadding,
            background: colors.background_field,
            display: `flex`,
            flexDirection: `row`,
        },
        span_fieldInfo: {
            padding: sizes.textPadding,
            color: colors.text,
            fontSize: sizes.fontSize,
            fontWeight: font.fontWeight_normal,
        },
        input_fieldEntry: {
            padding: sizes.textPadding,
            color: colors.text,
            fontSize: sizes.fontSize_input,
            fontWeight: font.fontWeight_normal,
        },
        button_fieldInline: {
            ...borderProps,
            marginLeft: sizes.elementGap,
            padding: sizes.textPadding,
            background: colors.background_button,
            color: colors.text_button,
            fontSize: sizes.fontSize_button,
            fontWeight: font.fontWeight_button,
        },
        div_formActionRow: {
            display: `flex`,
            flexDirection: `row`,
            justifyContent: `flex-end`,
        },
        button_formAction: {
            ...borderProps,
            marginLeft: sizes.elementGap,
            padding: sizes.textPadding,
            background: colors.background_button,
            color: colors.text_button,
            fontSize: sizes.fontSize_input,
            fontWeight: font.fontWeight_button,
        },

        div_error: {
            ...borderProps,
            marginBottom: sizes.sectionGap,
            padding: sizes.rowPadding,
            background: colors.background_error,
        },
        span_error: {
            padding: sizes.textPadding,
            color: colors.text_error,
            fontSize: sizes.fontSize,
            fontFamily: font.fontFamily,
            fontWeight: font.fontWeight_button,
        },
    } as const;
};

export const purpleColors = {
    purple: `#863d8f`,
    purpleLite: `#a75da7`,
    purpleBackgroundLite: `#ddbfdd`,
    blue: `#3baccf`,
    gray: `#656364`,
    lightGray: `#f8f6f7`,
    lightBackgroundGray: `#e8e6e7`,
    borderGray: `#d7c7d7`,
    headerWhite: `#ffffff`,
    headerGray: `#cecece`,
    menuWhite: `#ffffff`,
    bodyWhite: `#ffffff`,
    buttonGray: `#a0a1a5`,
    buttonWhite: `#e2e3e9`,
    headingGray: `#f8f6f7`,
    cardLightGray: `#f8f8f8`,
    textWhite: `#ffffff`,
    textBlack: `#2b2b2b`,
    textGray: `#696768`,

    // New Colors
    warnRed: `#C56364`,
    errorRed: `#C56364`,
    deleteRed: `#C56364`,
    changedYellow: `#F5F5C5`,
};

export const purpleThemeColors: typeof basicThemeColors = {
    ...basicThemeColors,
    text: `#2b2b2b`,
    text_button: `#ffffff`,
    // text_error: `#ffffff`,
    border: `#863d8f`,
    background: `#ffffff`,
    background_field: `#dddddd`,
    background_button: `#863d8f`,
    // background_error: `#C56364`,
};

export const vscodeThemeColors = {
    colors: {
        text: `#569CD6`,
        border: `#6796E6`,
        background: `#1e1e1e`,
        background_field: `#2e2e2e`,
    },
};

// eslint-disable-next-line import/no-mutable-exports
export let theme = createTheme(basicThemeColors, basicThemeSizes, basicFont);
// eslint-disable-next-line import/no-mutable-exports
// export let theme = createTheme(purpleThemeColors, basicThemeSizes, basicFont);

export const setTheme = (colors: ThemeColors, sizes: ThemeSizes, font: ThemeFont) => {
    theme = createTheme(purpleThemeColors, basicThemeSizes, basicFont);
};
