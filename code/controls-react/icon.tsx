import React from 'react';
import { ThemeIconStyle, theme } from 'themes/theme';
import { MdMenu, MdArrowBack, MdCheckBoxOutlineBlank, MdErrorOutline, MdContentCopy, MdDashboard } from 'react-icons/md';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { FaRedo, FaPlus, FaMinus } from 'react-icons/fa';
import { View } from 'react-native-lite';
import { IconKind } from './icon-kind';

function getIcon(kind: IconKind) {
    switch (kind) {
        case IconKind.menu: return { name: `menu`, component: MdMenu };
        case IconKind.back: return { name: `arrow-back`, component: MdArrowBack };
        case IconKind.error: return { name: `error-outline`, component: MdErrorOutline };
        case IconKind.expanded: return { name: `chevron-down`, component: FiChevronDown };
        case IconKind.collapsed: return { name: `chevron-right`, component: FiChevronRight };
        case IconKind.copy: return { name: `content-copy`, component: MdContentCopy };
        case IconKind.retry: return { name: `reload`, component: FaRedo };
        case IconKind.dashboard: return { name: `dashboard`, component: MdDashboard };
        case IconKind.add: return { name: `plus`, component: FaPlus };
        case IconKind.remove: return { name: `minus`, component: FaMinus };

        // case IconKind.Account: return { name: `account-circle`, component: MaterialIcons };
        // case IconKind.Message: return { name: `message`, component: MaterialIcons };
        // case IconKind.Subscription: return { name: `ticket-account`, component: MaterialCommunityIcons };
        // case IconKind.Campaigns: return { name: `calendar-multiselect`, component: MaterialCommunityIcons };
        // case IconKind.Contacts: return { name: `contacts`, component: MaterialIcons };
        // case IconKind.Keywords: return { name: `key-variant`, component: MaterialCommunityIcons };
        // case IconKind.Resources: return { name: `collections-bookmark`, component: MaterialIcons };
        // case IconKind.Admin: return { name: `settings`, component: MaterialIcons };
        // case IconKind.Solutions: return { name: '', component: FontAwesome };
        // case IconKind.Texting: return { name: '', component: FontAwesome };
        // case IconKind.Pricing: return { name: '', component: FontAwesome };
        // case IconKind.Download: return { name: '', component: FontAwesome };

        default:
            return { name: `unknown`, component: MdCheckBoxOutlineBlank };
    }
}

export const Icon = (props: { kind: IconKind, style?: ThemeIconStyle }) => {
    const icon = getIcon(props.kind);
    const IconComponent = icon.component;
    const size = props.style?.size ?? theme.icon.size ?? theme.sizes.fontSize;
    return (
        <View style={{ width: size, height: size }}>
            <IconComponent name={icon.name} size={size} color={props.style?.color ?? theme.icon.color} />
        </View>
    );
};
