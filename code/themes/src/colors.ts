
const mainThemeColors = {
    text: `#333333`,
    text_button: `#333333`,
    border: `#cccccc`,
    background: `#ffffff`,
    background_field: `#dddddd`,
    background_button: `#eeeeee`,
} as const;

const mainThemSizes = {
    textPadding: 4,
    borderWidth: 1,
    borderRadius: 4,
    elementPadding: 8,
    rowPadding: 4,
} as const;

const createTheme = (colors: typeof mainThemeColors, sizes: typeof mainThemSizes) => {
    return {
        colors,

        div_fieldRow: {
            marginBottom: sizes.rowPadding,
            background: colors.background_field,
            border: `solid ${sizes.borderWidth}px ${colors.border}`, borderRadius: `${sizes.borderRadius}px`,
            display: `flex`,
            flexDirection: `row`,
        },
        span_fieldInfo: { padding: sizes.textPadding, color: colors.text },
        button_fieldInline: {
            padding: sizes.textPadding,
            marginLeft: sizes.elementPadding,
            background: colors.background_button,
            color: colors.text_button,
            fontWeight: `bold`,
            border: `solid ${sizes.borderWidth}px ${colors.border}`, borderRadius: `${sizes.borderRadius}px`,
        },
        div_formActionRow: {
            marginBottom: sizes.rowPadding,
            display: `flex`,
            flexDirection: `row`,
            justifyContent: `flex-end`,
        },
        button_formAction: {
            padding: sizes.textPadding,
            marginLeft: sizes.elementPadding,
            background: colors.background_button,
            color: colors.text_button,
            fontWeight: `bold`,
            border: `solid ${sizes.borderWidth}px ${colors.border}`, borderRadius: `${sizes.borderRadius}px`,
        },
    } as const;
};

export const mainTheme = createTheme(mainThemeColors, mainThemSizes);

export const vscodeTheme = {
    colors: {
        text: `#569CD6`,
        border: `#6796E6`,
        background: `#1e1e1e`,
        background_field: `#2e2e2e`,
    },
};
