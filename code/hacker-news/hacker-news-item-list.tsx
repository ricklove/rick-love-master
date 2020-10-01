import React from 'react';
import { View, Text } from 'react-native-lite';
import { formatDate_FromNow } from 'utils/dates';
import { HackerNewsItem, Timestamp } from './hacker-news-types';

export const HackerNewsItemList = ({
    posts,
}: {
    posts: HackerNewsItem[];
}) => {
    return (
        <>
            <View style={styles.container}>
                {posts.map((x, i) => (
                    <View key={`${x.id}`}>
                        <HackerNewsListItem item={x} index={i} />
                    </View>
                ))}
            </View>
        </>
    );
};

const styles = {
    container: {
    },
    numberText: {
        fontSize: 12,
    },
    titleText: {
        fontSize: 14,
        fontWeight: `bold`,
    },
    infoText: {
        fontSize: 12,
    },
    pointsText: {
        fontSize: 10,
    },
    authorsText: {
        fontSize: 10,
    },
    timeText: {
        fontSize: 10,
    },
    actionsText: {
        fontSize: 10,
    },
} as const;

const getUrlDomain = (url: undefined | string) => url ? `(${new URL(url).host})` : ``;
const getTimeText = (timestamp: Timestamp) => `${formatDate_FromNow(new Date(timestamp * 1000))}`;

const HackerNewsListItem = ({ item, index }: { item: HackerNewsItem, index: number }) => {
    if (item.type === `story` || item.type === `job`) {
        return (
            <>
                <View style={{ display: `flex`, flexDirection: `row`, alignItems: `flex-start` }}>
                    {/* Index */}
                    <View style={{ display: `flex`, flexDirection: `row`, justifyContent: `center`, width: 32 }}>
                        <Text style={styles.numberText}>{`${index + 1}.`}</Text>
                    </View>
                    {/* Actions */}
                    {/* Content */}
                    <View style={{ display: `flex`, flexDirection: `column` }}>
                        <View style={{ display: `flex`, flexDirection: `row`, justifyContent: `flex-start`, alignItems: `flex-end` }}>
                            <Text style={styles.titleText}>{item.title}</Text>
                            <Text style={styles.infoText}>{` ${getUrlDomain(item.url)}`}</Text>
                        </View>
                        <View style={{ display: `flex`, flexDirection: `row`, justifyContent: `flex-start`, alignItems: `flex-end` }}>
                            <Text style={styles.pointsText}>{`${item.score} points`}</Text>
                            <Text style={styles.authorsText}>{` by`}</Text>
                            <Text style={styles.authorsText}>{` ${item.by}`}</Text>
                            <Text style={styles.timeText}>{` ${getTimeText(item.time)}`}</Text>
                            {item.type === `story` && (
                                <>
                                    <Text style={styles.timeText}>{` | ${item.descendants} comments`}</Text>
                                </>
                            )}
                        </View>
                    </View>

                </View>
                {/* <Text>{JSON.stringify(item, null, 2)}</Text> */}
            </>
        );
    }
    return (<Text>{JSON.stringify(item, null, 2)}</Text>);

};
