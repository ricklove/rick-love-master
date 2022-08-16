```ts
const ItemView = ({ item }: { item: ItemType }) => {
  return (
    <>
      <div className='flex flex-col'>
        <div>{item.value}</div>
      </div>
    </>
  );
};
```
