/* eslint-disable @typescript-eslint/no-unused-vars */
export type ThemeViewStyle = {
    display?: 'flex';
    flexDirection?: 'row' | 'column';
    flexWrap?: 'wrap' | 'nowrap';
    flex?: number;
    justifyContent?: 'flex-start' | 'center' | 'flex-end';
    alignItems?: 'center';
    overflow?: 'visible' | 'hidden';

    background?: string;

    margin?: number;
    marginLeft?: number;
    marginRight?: number;
    marginTop?: number;
    marginBottom?: number;
    padding?: number;
    paddingRight?: number;
    paddingLeft?: number;
    paddingTop?: number;
    paddingBottom?: number;

    width?: number;
    height?: number;

    borderWidth?: number;
    borderLeftWidth?: number;
    borderRightWidth?: number;
    borderTopWidth?: number;
    borderBottomWidth?: number;

    borderRadius?: number;
    borderColor?: string;
    borderStyle?: 'solid';
};
export type ThemeTextStyle = {
    padding?: number;
    color?: string;

    fontFamily?: string;
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    //  whiteSpace?: 'normal' | 'nowrap' | 'pre';
    minWidth?: number;

    outline?: string;
};
export type ThemeIconStyle = {
    color?: string;
    size?: number;
};

export const extractViewStyle = (style: ThemeViewStyle & ThemeTextStyle): ThemeViewStyle => {
    return {
        display: style.display,
        flexDirection: style.flexDirection,
        flex: style.flex,
        justifyContent: style.justifyContent,
        alignItems: style.alignItems,
        overflow: style.overflow,

        background: style.background,

        margin: style.margin,
        marginLeft: style.margin ?? style.marginLeft,
        marginRight: style.margin ?? style.marginRight,
        marginTop: style.margin ?? style.marginTop,
        marginBottom: style.margin ?? style.marginBottom,
        padding: style.padding,
        paddingRight: style.padding ?? style.paddingRight,
        paddingLeft: style.padding ?? style.paddingLeft,
        paddingTop: style.padding ?? style.paddingTop,
        paddingBottom: style.padding ?? style.paddingBottom,

        width: style.width,
        height: style.height,

        borderWidth: style.borderWidth,
        borderRadius: style.borderRadius,
        borderColor: style.borderColor,
        borderStyle: style.borderStyle,
    };
};
export const extractTextStyle = (style: ThemeViewStyle & ThemeTextStyle): ThemeTextStyle => {
    return {
        // padding: style.padding,
        color: style.color,

        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        // whiteSpace: style.whiteSpace,

        outline: style.outline,
    };
};

export const basicThemeColors = {
    text: `#333333`,
    text_header: `#333333`,
    text_button: `#333333`,
    text_error: `#333333`,
    text_errorMessage: `#ff3333`,
    border: `#cccccc`,
    border_minor: `#cccccc`,
    border_input: `#cccccc`,
    background: `#ffffff`,
    background_field: `#dddddd`,
    background_button: `#eeeeee`,
    background_error: `#ffcccc`,
    loader: `#3333ff`,
    icon: `#3333ff`,
};
export type RectSize = { all?: number, left?: number, right?: number, top?: number, bottom?: number };
const getBorderSizes = (size: RectSize) => {
    return {
        borderWidth: size.all,
        borderLeftWidth: size.left ?? size.all,
        borderRightWidth: size.right ?? size.all,
        borderTopWidth: size.top ?? size.all,
        borderBottomWidth: size.bottom ?? size.all,
    };
};

export const basicThemeSizes = {
    textPadding: 4,
    borderWidth: { all: 1 } as RectSize,
    borderWidth_minor: { all: 1 } as RectSize,
    borderWidth_input: { all: 1 } as RectSize,
    borderRadius: 4,
    sectionGap: 16,
    elementGap: 8,
    rowGap: 4,
    rowPadding: 4,

    fontSize: 14,
    fontSize_input: 16,
    fontSize_button: 14,
    fontSize_header: 16,

    icon: 14,
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
        ...getBorderSizes(sizes.borderWidth),

        borderRadius: sizes.borderRadius,
        borderColor: colors.border,
        borderStyle: `solid`,
    } as const;

    const borderProps_minor = {
        ...getBorderSizes(sizes.borderWidth_minor),

        borderRadius: sizes.borderRadius,
        borderColor: colors.border_minor,
        borderStyle: `solid`,
    } as const;

    const borderProps_input = {
        ...getBorderSizes(sizes.borderWidth_input),

        borderRadius: sizes.borderRadius,
        borderColor: colors.border_input,
        borderStyle: `solid`,
        outline: `none`,
    } as const;

    let sView: ThemeViewStyle = {};
    let sText: ThemeTextStyle = {};
    let sIcon: ThemeIconStyle = {};
    let sTextView: ThemeTextStyle & ThemeViewStyle = {};

    const theme = {
        colors,
        sizes,
        font,

        view_panel: sView = {
            background: colors.background,
            padding: sizes.elementGap,
        },
        view_form: sView = {
            ...borderProps,
            marginBottom: sizes.sectionGap,
            padding: sizes.elementGap,
            // background: colors.background_field,
        },
        text_formTitle: sText = {
            padding: sizes.textPadding,
            color: colors.text_header,
            fontSize: sizes.fontSize_header,
            fontFamily: font.fontFamily,
            fontWeight: font.fontWeight_header,
        },
        view_formFields: sView = {
            // ...borderProps,
            ...borderProps_minor,
            // padding: sizes.elementGap,
            marginBottom: sizes.rowGap,
            background: colors.background_field,
            // alignItems: `center`,
        },
        view_fieldRow: sView = {
            // ...borderProps,
            // ...borderProps_minor,
            marginBottom: sizes.rowGap,
            padding: sizes.rowPadding,
            // background: colors.background_field,
            display: `flex`,
            flexDirection: `row`,

            alignItems: `center`,
            flexWrap: `wrap`,
        },
        text_fieldLabel: sText = {
            padding: sizes.textPadding,
            color: colors.text,
            fontSize: sizes.fontSize,
            fontWeight: font.fontWeight_normal,
            minWidth: 80,
            //  whiteSpace: `nowrap`,
        },
        input_fieldEntry: sText = {
            ...borderProps_input,
            padding: sizes.textPadding,
            color: colors.text,
            fontSize: sizes.fontSize_input,
            fontWeight: font.fontWeight_normal,
            minWidth: 80,
        },
        button_fieldInline: sTextView = {
            ...borderProps,
            // marginLeft: sizes.elementGap,
            margin: sizes.textPadding,
            padding: sizes.textPadding,
            background: colors.background_button,
            color: colors.text_button,
            fontSize: sizes.fontSize_button,
            fontWeight: font.fontWeight_button,
            display: `flex`,
        },
        button_fieldInline_alt: sTextView = {
            ...sTextView,
            background: colors.text_button,
            color: colors.background_button,
            borderColor: colors.background_button,
        },
        view_formActionRow: sView = {
            display: `flex`,
            flexDirection: `row`,
            justifyContent: `flex-end`,
            marginBottom: sizes.elementGap,
        },
        button_formAction: sTextView = {
            ...borderProps,
            marginLeft: sizes.elementGap,
            padding: sizes.textPadding,
            background: colors.background_button,
            color: colors.text_button,
            fontSize: sizes.fontSize_button,
            fontWeight: font.fontWeight_button,
        },
        button_formAction_alt: sTextView = {
            ...sTextView,
            background: colors.text_button,
            color: colors.background_button,
            borderColor: colors.background_button,
        },

        view_error: sView = {
            ...borderProps,
            marginBottom: sizes.sectionGap,
            padding: sizes.rowPadding,
            background: colors.background_error,
        },
        text_error: sText = {
            padding: sizes.textPadding,
            color: colors.text_error,
            fontSize: sizes.fontSize,
            fontFamily: font.fontFamily,
            fontWeight: font.fontWeight_button,
        },
        text_errorMessage: sText = {
            padding: sizes.textPadding,
            color: colors.text_errorMessage,
            fontSize: sizes.fontSize,
            fontFamily: font.fontFamily,
            fontWeight: font.fontWeight_button,
        },

        icon: sIcon = {
            size: sizes.icon,
            color: colors.icon,
        },
        icon_errorMessage: sIcon = {
            size: sizes.icon,
            color: colors.text_errorMessage,
        },
    } as const;

    return theme;
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
    text_header: `#863d8f`,
    text_button: `#ffffff`,
    // text_error: `#ffffff`,
    border: `#863d8f`,
    border_minor: `#863d8f`,
    // border_minor: `#aaaaaa`,
    border_input: `#aaaaaa`,
    background: `#ffffff`,
    background_field: `#dddddd`,
    background_button: `#863d8f`,
    // background_error: `#C56364`,
    loader: `#863d8f`,
    icon: `#863d8f`,
};

export const purpleSizes: typeof basicThemeSizes = {
    ...basicThemeSizes,
    borderWidth: { all: 1, bottom: 4 },
    borderWidth_minor: { all: 0, bottom: 1 },
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
// export let theme = createTheme(basicThemeColors, basicThemeSizes, basicFont);
// eslint-disable-next-line import/no-mutable-exports
export let theme = createTheme(purpleThemeColors, purpleSizes, basicFont);

export const setTheme = (colors: ThemeColors, sizes: ThemeSizes, font: ThemeFont) => {
    theme = createTheme(purpleThemeColors, basicThemeSizes, basicFont);
};
