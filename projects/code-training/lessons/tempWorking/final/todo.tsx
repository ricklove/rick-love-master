/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import { useAsyncWorker } from './hooks';
import { apiService } from './service';
import { TodoItemData } from './types';

const styles = {
    container: {
        padding: 4,
        backgroundColor: `#000000`,
        color: `#FFFFFF`,
    },
    itemContainer: {
        margin: 4,
        padding: 4,
        backgroundColor: `#333333`,
        color: `#FFFFFF`,
    },
    row: {
        display: `flex`,
        flex: 1,
        flexDirection: `row`,
        alignItems: `center`,
    },
    flex1: {
        display: `flex`,
        flex: 1,
    },
    button: {
        margin: 4,
        padding: 8,
        backgroundColor: `#111111`,
    },
} as const;

const getUniqueKey = () => {
    return `${Date.now()}:${Math.random()}`;
};
const createNewTodoItem = () => {
    return { key: getUniqueKey(), text: `New Task`, isDone: false };
};

export const TodoList = (props: {}) => {

    const [items, setItems] = useState([] as TodoItemData[]);
    const { loading, error, doWork } = useAsyncWorker();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        doWork(async (checkMounted) => {
            const result = await apiService.loadData();
            if (!checkMounted()) { return; }

            setItems(result?.items ?? [createNewTodoItem()]);
        }, { messageIfError: `Failed to Load Data` });
    };

    const saveData = () => {
        doWork(async () => {
            await apiService.saveData({ items });
        }, { messageIfError: `Failed to Save Data` });
    };

    const changeItem = (value: TodoItemData) => {
        setItems(s => s.map(x => x.key === value.key ? value : x));
    };
    const addItem = () => {
        setItems(s => [...s, createNewTodoItem()]);
    };
    const deleteItem = (value: TodoItemData) => {
        setItems(s => s.filter(x => x.key !== value.key));
    };

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.row}>
                    <span>{`❗ ${error.message}`}</span>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {loading && (
                <div style={styles.row}>
                    <span>{`🕒 Loading`}</span>
                </div>
            )}
            <div style={styles.row}>
                <div style={styles.flex1} />
                <div style={styles.button} onClick={loadData} >
                    <span>{`💽 Reload`}</span>
                </div>
                <div style={styles.button} onClick={saveData} >
                    <span>{`💾 Save`}</span>
                </div>
            </div>
            {items.map(x => (
                <TodoItem key={x.key} item={x} onChange={changeItem} onDelete={deleteItem} />
            ))}
            <div style={styles.row}>
                <div style={styles.button} onClick={addItem} >
                    <span>{`➕ Add`}</span>
                </div>
            </div>
        </div>
    );
};


const TodoItem = (props: { item: TodoItemData, onChange: (value: TodoItemData) => void, onDelete: (value: TodoItemData) => void }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [itemText, setItemText] = useState(props.item.text);
    const changeText = () => {
        setIsEditing(false);
        props.onChange({ ...props.item, text: itemText });
    };
    const toggleDone = () => {
        props.onChange({ ...props.item, isDone: !props.item.isDone });
    };

    return (
        <div style={styles.itemContainer}>
            {!isEditing && (
                <div style={styles.row} onClick={toggleDone}>
                    <div>
                        <span>{props.item.isDone ? `✔ 🐱‍🏍 ` : `◻ 😾 `}</span>
                    </div>
                    <div style={styles.flex1}>
                        <span>{itemText}</span>
                    </div>
                    <div style={styles.button}
                        onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
                    >
                        <span>{`✏ Edit`}</span>
                    </div>
                    <div style={styles.button}
                        onClick={(e) => { e.preventDefault(); props.onDelete(props.item); }}
                    >
                        <span>{`❌ Delete`}</span>
                    </div>
                </div>
            )}
            {isEditing && (
                <div style={styles.row}>
                    <input style={styles.flex1} type='text' value={itemText}
                        autoFocus
                        onChange={e => setItemText(e.target.value)}
                        onBlur={e => { e.preventDefault(); changeText(); }}
                        onKeyDown={e => { if (e.key === `Enter`) { e.preventDefault(); changeText(); } }}
                    />
                    <div style={styles.button} onClick={changeText}>
                        <span>{`✔ Done`}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
