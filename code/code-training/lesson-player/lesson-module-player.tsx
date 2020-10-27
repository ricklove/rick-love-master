/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native-lite';
import { LessonProjectFilesEditor, LessonProjectEditorMode, LessonFileEditorMode } from '../common/components/lesson-file-editor';
import { LessonData, LessonExperiment, LessonModule, LessonProjectFileSelection, LessonProjectState, LessonStep_ConstructCode, LessonStep_UnderstandCode, SetProjectState } from '../common/lesson-types';
import { lessonExperiments_createReplacementProjectState, lessonExperiments_calculateProjectStateReplacements } from '../common/replacements';
import { LessonView_ConstructCode, LessonView_ExperimentCode, LessonView_PreviewResult, LessonView_UnderstandCode } from '../common/components/lesson-view';
import { LessonProjectStatePreview, LessonRenderView } from '../common/components/lesson-render-view';

const styles = {
    container: {
        background: `#111111`,
    },
    containerPanel: {
        background: `#292a2d`,
    },
    editorModeTabRowView: {
        flexDirection: `row`,
        paddingLeft: 16,
    },
    editorModeTabView: {
        background: `#1e1e1e`,
        alignSelf: `flex-start`,
        padding: 8,
        marginRight: 1,
    },
    editorModeTabView_selected: {
        background: `#292a2d`,
        alignSelf: `flex-start`,
        padding: 8,
        marginRight: 1,
    },
    editorModeTabText: {
        fontSize: 14,
        color: `#FFFFFFF`,
    },
    editorModeTabText_selected: {
        fontSize: 14,
        color: `#FFFF88`,
    },
    buttonView: {
        background: `#1e1e1e`,
        alignSelf: `flex-start`,
        padding: 8,
        margin: 1,
    },
    buttonText: {
        fontSize: 14,
        color: `#FFFFFFF`,
    },
    sectionHeaderText: {
        margin: 8,
        fontSize: 18,
        color: `#FFFF88`,
    },
    infoView: {
    },
    infoText: {
        margin: 8,
        fontSize: 12,
        wrap: `wrap`,
    },
    lessonFieldView: {
        flexDirection: `row`,
    },
    lessonFieldLabelText: {
        minWidth: 80,
        padding: 4,
        fontSize: 12,
    },
    lessonFieldText: {
        flex: 1,
        padding: 4,
        fontSize: 12,
        wrap: `wrap`,
    },
    jsonText: {
        padding: 4,
        fontSize: 12,
        color: `#FFFFFF`,
        background: `#000000`,
    },
} as const;


const getLessonNavigatorItems = (module: LessonModule) => {
    const items = module.lessons.flatMap((x, i) => [
        { kind: `lesson` as const, lesson: x, label: `${i + 1}. ${x.title}` },
        { kind: `preview` as const, lesson: x, label: `  🔎 Preview the Result` },
        { kind: `construct` as const, lesson: x, label: `  📝 Construct the Code` },
        { kind: `understand` as const, lesson: x, label: `  💡 Understand the Code` },
        { kind: `experiment` as const, lesson: x, label: `  🔬 Experiment with the Code` },
    ]).map(x => ({ ...x, key: x.lesson.key + x.kind }));
    return items;
};
type NavigatorItem = ReturnType<typeof getLessonNavigatorItems>[0];

export const LessonModulePlayer = (props: { module: LessonModule, setProjectState: SetProjectState }) => {
    const [items, setItems] = useState(getLessonNavigatorItems(props.module));
    const [activeItem, setActiveItem] = useState(null as null | NavigatorItem);

    useEffect(() => {
        const newItems = getLessonNavigatorItems(props.module);
        setItems(newItems);
        nextStep();
    }, [props.module]);

    useEffect(() => {
        if (activeItem?.kind === `lesson`) {
            nextStep();
        }
    }, [activeItem]);

    const nextStep = () => {
        console.log(`LessonModulePlayer nextStep`, { activeItem });
        if (!items) { return; }

        const itemSteps = items.filter(x => x.kind !== `lesson`);
        const activeItemStepIndex = itemSteps.findIndex(x => x.key === activeItem?.key);
        const activeItemIndex = items.findIndex(x => x.key === activeItem?.key);
        const nextItem = (activeItemStepIndex >= 0 ? itemSteps[activeItemStepIndex + 1] : null)
            ?? (activeItemIndex >= 0 ? items[activeItemIndex + 1] : null)
            ?? items[0];
        setTimeout(() => {
            setActiveItem(nextItem);
        }, 1000);
    };

    return (
        <>
            <View style={styles.container}>
                <LessonModuleNavigator items={items} activeItem={activeItem ?? undefined} onChange={x => setActiveItem(x)} />
                <View key={activeItem?.key}>
                    {activeItem?.kind === `preview` && (
                        <LessonView_PreviewResult data={activeItem.lesson} setProjectState={props.setProjectState} onDone={nextStep} />
                    )}
                    {activeItem?.kind === `construct` && (
                        <LessonView_ConstructCode data={activeItem.lesson} onDone={nextStep} />
                    )}
                    {activeItem?.kind === `understand` && (
                        <LessonView_UnderstandCode data={activeItem.lesson} onDone={nextStep} />
                    )}
                    {activeItem?.kind === `experiment` && (
                        <LessonView_ExperimentCode data={activeItem.lesson} setProjectState={props.setProjectState} onDone={nextStep} />
                    )}
                </View>
            </View>
        </>
    );
};


const navigatorStyles = {
    container: {
        flexDirection: `column`,
    },
    itemsContainer: {
        paddingLeft: 24,
        background: `#111111`,
    },
    itemView_header: {
        flexDirection: `row`,
        alignItems: `center`,
        background: `#111111`,
        // alignSelf: `flex-start`,
        padding: 4,
        marginRight: 1,
    },
    itemView: {
        flexDirection: `row`,
        alignItems: `center`,
        background: `#1e1e1e`,
        // alignSelf: `flex-start`,
        padding: 4,
        marginRight: 1,
    },
    itemView_selected: {
        flexDirection: `row`,
        alignItems: `center`,
        background: `#292a2d`,
        // alignSelf: `flex-start`,
        padding: 4,
        marginRight: 1,
    },
    itemText: {
        fontSize: 14,
    },
    itemText_selected: {
        fontSize: 14,
        color: `#FFFF88`,
    },
    // headerTabView: {
    //     flexDirection: `row`,
    //     alignItems: `center`,
    //     // background: `#1e1e1e`,
    //     // alignSelf: `flex-start`,
    //     padding: 4,
    //     marginRight: 1,
    // },
    // headerTabText: {
    //     fontSize: 14,
    // },
    // moveButtonView: {
    //     minWidth: 24,
    //     justifyContents: `center`,
    //     alignItems: `center`,
    // },
} as const;

export const LessonModuleNavigator = (props: { items: NavigatorItem[], activeItem?: NavigatorItem, onChange: (value: NavigatorItem) => void }) => {
    const { items, activeItem } = props;

    const [isExpanded, setIsExpanded] = useState(true);

    const changeItem = (item: typeof items[0]) => {
        props.onChange(item);
    };

    if (!isExpanded && activeItem) {
        return (
            <>
                <TouchableOpacity onPress={() => setIsExpanded(() => true)}>
                    <View style={navigatorStyles.itemView_header}>
                        <Text style={navigatorStyles.itemText_selected}>{`${`🧭 `}Navigate`}</Text>
                    </View>
                    <View style={navigatorStyles.itemsContainer}>
                        <View style={navigatorStyles.itemView_selected}>
                            <Text style={navigatorStyles.itemText_selected}>{`${`➡ `}${activeItem.label}`}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        );
    }

    return (
        <>
            <View style={navigatorStyles.container}>
                <TouchableOpacity onPress={() => setIsExpanded(() => false)}>
                    <View style={navigatorStyles.itemView_header}>
                        <Text style={navigatorStyles.itemText_selected}>{`${`🧭 `}Navigate`}</Text>
                    </View>
                </TouchableOpacity>
                <View style={navigatorStyles.itemsContainer}>
                    {items.map(x => (
                        <TouchableOpacity key={x.key} onPress={() => { setIsExpanded(false); if (x.key === activeItem?.key) { return; } changeItem(x); }}>
                            <View style={x.key === activeItem?.key ? navigatorStyles.itemView_selected : navigatorStyles.itemView}>
                                <Text style={x.key === activeItem?.key ? navigatorStyles.itemText_selected : navigatorStyles.itemText}>{`${x.key === activeItem?.key ? `➡ ` : ``}${x.label}`}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </>
    );
};
