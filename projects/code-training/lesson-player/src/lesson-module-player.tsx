/* eslint-disable react/no-array-index-key */
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Utterances } from 'comments/utterances';
import { Text, TouchableOpacity, View } from '@ricklove/react-native-lite';
import {
  LessonView_ConstructCode,
  LessonView_ExperimentCode,
  LessonView_PreviewResult,
  LessonView_UnderstandCode,
} from '../common/components/lesson-view';
import { LessonModule, SetProjectState } from '../common/lesson-types';

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
  infoView: {},
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
  ]);

  // Add Intro Preview
  const lastLesson = module.lessons[module.lessons.length - 1];
  if (lastLesson) {
    const lastLessonMainFile = lastLesson.projectState.files.find((x) => x.path === lastLesson.focus.filePath);
    items.unshift({
      kind: `preview` as const,
      lesson: {
        ...lastLesson,
        key: `lesson-`,
        focus: { ...lastLesson.focus, index: 0, length: lastLessonMainFile?.content.length ?? 0 },
      },
      label: `🎯 Lesson Objective`,
    });
  }

  return items.map((x) => ({ ...x, key: x.lesson.key + x.kind }));
};
type NavigatorItem = ReturnType<typeof getLessonNavigatorItems>[0];

export const LessonModulePlayer = (props: { module: LessonModule; setProjectState: SetProjectState }) => {
  const [items, setItems] = useState(getLessonNavigatorItems(props.module));
  const [activeItem, setActiveItem] = useState(null as null | NavigatorItem);

  useEffect(() => {
    const newItems = getLessonNavigatorItems(props.module);
    setItems(newItems);
    nextStep({ items: newItems, useTimeout: false });
  }, [props.module]);

  const navigate = (targetItem: NavigatorItem) => {
    if (targetItem.kind !== `lesson`) {
      setActiveItem(targetItem);
      return;
    }

    nextStep({ items, activeItem: targetItem, useTimeout: false });
  };

  const nextStep = (options?: { items?: NavigatorItem[]; activeItem?: NavigatorItem; useTimeout: boolean }) => {
    // console.log(`LessonModulePlayer nextStep`, { activeItem, options });
    const itemsToUse = options?.items ?? items;
    const activeItemToUse = options?.activeItem ?? activeItem;
    if (!itemsToUse) {
      return;
    }

    const itemSteps = itemsToUse.filter((x) => x.kind !== `lesson`);
    const activeItemStepIndex = itemSteps.findIndex((x) => x.key === activeItemToUse?.key);
    const activeItemIndex = itemsToUse.findIndex((x) => x.key === activeItemToUse?.key);
    const nextItem =
      (activeItemStepIndex >= 0 ? itemSteps[activeItemStepIndex + 1] : null) ??
      (activeItemIndex >= 0 ? itemsToUse[activeItemIndex + 1] : null) ??
      itemsToUse[0];

    if (options?.useTimeout) {
      setTimeout(() => {
        setActiveItem(nextItem);
      }, 1000);
    } else {
      setActiveItem(nextItem);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {items && (
          <LessonModuleNavigator items={items} activeItem={activeItem ?? undefined} onChange={navigate}>
            <View key={activeItem?.key}>
              {activeItem?.kind === `preview` && (
                <LessonView_PreviewResult
                  data={activeItem.lesson}
                  setProjectState={props.setProjectState}
                  onDone={nextStep}
                />
              )}
              {activeItem?.kind === `construct` && (
                <LessonView_ConstructCode data={activeItem.lesson} onDone={nextStep} />
              )}
              {activeItem?.kind === `understand` && (
                <LessonView_UnderstandCode data={activeItem.lesson} onDone={nextStep} />
              )}
              {activeItem?.kind === `experiment` && (
                <LessonView_ExperimentCode
                  data={activeItem.lesson}
                  setProjectState={props.setProjectState}
                  onDone={nextStep}
                />
              )}
            </View>

            <div>
              <h3 style={{ borderTop: `solid 1px #3ca4ff`, padding: 8, margin: 0, marginTop: 16, textAlign: `center` }}>
                Community Comments - {props.module.title}
              </h3>
              <Utterances repo='ricklove/ricklove-code-lesson-comments' />
            </div>
          </LessonModuleNavigator>
        )}
      </View>
    </>
  );
};

const navigatorStyles = {
  outerContainer: {
    flexDirection: `row`,
  },
  contentContainer: {
    flex: 1,
    overflow: `auto`,
  },
  container: {
    flexDirection: `column`,
  },
  itemsContainer: {
    // paddingLeft: 24,
    background: `#333333`,
  },
  itemView_header: {
    flexDirection: `row`,
    alignItems: `center`,
    background: `#333333`,
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

export const LessonModuleNavigator = (props: {
  children: ReactNode;
  items: NavigatorItem[];
  activeItem?: NavigatorItem;
  onChange: (value: NavigatorItem) => void;
}) => {
  const { items, activeItem } = props;

  const hasLoadedHash = useRef(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);

  const onLoad = (width: number) => {
    const isNarrow = width < 600;
    setIsNarrowScreen(isNarrow);
  };

  useEffect(() => {
    if (isNarrowScreen) {
      setIsExpanded(false);
    }
  }, [isNarrowScreen]);

  useEffect(() => {
    if (!activeItem?.key) {
      return;
    }

    if (!hasLoadedHash.current) {
      hasLoadedHash.current = true;
      // First Load
      const hash = window.location.hash.substr(1);
      const matchItem = props.items.find((x) => x.key === hash);

      console.log(`LessonModuleNavigator load`, { hash, matchItem });
      if (matchItem) {
        props.onChange(matchItem);
        return;
      }
    }

    window.history.replaceState(null, activeItem?.label ?? ``, `#${activeItem?.key ?? ``}`);
  }, [activeItem]);

  const changeItem = (item: typeof items[0]) => {
    props.onChange(item);
  };

  if (!isExpanded && activeItem) {
    return (
      <>
        <TouchableOpacity onPress={() => setIsExpanded(() => true)}>
          <View style={navigatorStyles.itemView_header}>
            <Text style={navigatorStyles.itemText_selected}>{`${`🧭 `}Lesson Navigation`}</Text>
          </View>
          <View style={navigatorStyles.itemsContainer}>
            <View style={navigatorStyles.itemView_selected}>
              <Text style={navigatorStyles.itemText_selected}>{`${`➡ `}${activeItem.label}`}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {props.children}
      </>
    );
  }

  return (
    <>
      <div
        onLoad={(e) => {
          onLoad((e.target as HTMLDivElement).clientWidth);
        }}
      >
        <View style={navigatorStyles.outerContainer}>
          <View style={navigatorStyles.container}>
            <TouchableOpacity onPress={() => setIsExpanded(() => false)}>
              <View style={navigatorStyles.itemView_header}>
                <Text style={navigatorStyles.itemText_selected}>{`${`🧭 `}Lesson Navigation`}</Text>
              </View>
            </TouchableOpacity>
            <View style={navigatorStyles.itemsContainer}>
              {items.map((x) => (
                <TouchableOpacity
                  key={x.key}
                  onPress={() => {
                    if (isNarrowScreen) {
                      setIsExpanded(() => false);
                    }
                    if (x.key === activeItem?.key) {
                      return;
                    }
                    changeItem(x);
                  }}
                >
                  <View
                    style={x.key === activeItem?.key ? navigatorStyles.itemView_selected : navigatorStyles.itemView}
                  >
                    <Text
                      style={x.key === activeItem?.key ? navigatorStyles.itemText_selected : navigatorStyles.itemText}
                    >{`${x.key === activeItem?.key ? `➡ ` : ``}${x.label}`}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={navigatorStyles.contentContainer}>{props.children}</View>
        </View>
      </div>
    </>
  );
};
