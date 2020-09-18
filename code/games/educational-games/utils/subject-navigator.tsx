import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native-lite';
import { ProblemService } from '../problems/problems-service';


const subjectStyles = {
    container: {
        margin: 16,
    },
    header: {
        view: {
            margin: 4,
        },
        text: {
            fontSize: 16,
        },
    },
    section: {
        view: {
            margin: 4,
            flexDirection: `row`,
        },
        text: {
            fontSize: 16,
        },
    },
} as const;

export type SubjectProblemService = {
    getSections: () => { key: string, name: string, isComplete: boolean }[];
    gotoSection: (section: { key: string }) => void;
};
export const SubjectNavigator = (props: { problemService: SubjectProblemService, onOpen: () => void, onClose: () => void, onSubjectNavigation: () => void }) => {

    const [isExpanded, setIsExpanded] = useState(false);
    const toggle = () => {
        if (!isExpanded) {
            props.onOpen();
        }
        if (isExpanded) {
            props.onClose();
        }
        setIsExpanded(s => !s);
    };

    return (
        <View style={subjectStyles.container}>
            <TouchableOpacity onPress={toggle}>
                <View style={subjectStyles.header.view}>
                    <Text style={subjectStyles.header.text}>Sections</Text>
                </View>
            </TouchableOpacity>
            {isExpanded && (
                <View>
                    {props.problemService.getSections().map(s => (
                        <TouchableOpacity key={s.key} onPress={() => {
                            console.log(`SubjectNavigator onSection`, { s });
                            props.problemService.gotoSection(s);
                            props.onSubjectNavigation();
                            props.onClose();
                            setIsExpanded(false);
                            if (Platform.OS === `web`) {
                                window.scrollTo(0, 0);
                            }
                        }}>
                            <View style={subjectStyles.section.view}>
                                <Text style={subjectStyles.section.text}>{s.isComplete ? `✅` : `⬜`}</Text>
                                <Text style={subjectStyles.section.text}>{s.name}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

        </View>
    );
};
