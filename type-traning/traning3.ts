// see: https://qiita.com/uhyo/items/e4f54ef3b87afdd65546#%E9%9B%A3%E6%98%93%E5%BA%A6%E8%84%B1%E5%85%A5%E9%96%80%E3%83%AC%E3%83%99%E3%83%AB

// ------------------------------------------------------

function mapFromArray<T>(arr: T[], key: keyof T) {
  const result = new Map();
  for (const obj of arr) {
    result.set(obj[key], obj);
  }
  return result;
}

// 使用例
const data = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Mary Sue" },
  { id: 100, name: "Taro Yamada" }
];
const dataMap = mapFromArray(data, "id");
/*
dataMapは
Map {
  1 => { id: 1, name: 'John Smith' },
  2 => { id: 2, name: 'Mary Sue' },
  100 => { id: 100, name: 'Taro Yamada' }
}
というMapになる
*/

// エラー例
mapFromArray(data, "age");

// ------------------------------------------------------

type MyPartial<T> = { [k in keyof T]?: T[k] }

// 使用例
/*
 * T1は { foo?: number; bar?: string; } となる
 */
type T1 = MyPartial<{
  foo: number;
  bar: string;
}>;
/*
 * T2は { hoge?: { piyo: number; } } となる
 */
type T2 = MyPartial<{
  hoge: {
    piyo: number;
  };
}>;

// ------------------------------------------------------

interface EventPayloads {
  start: {
    user: string;
  };
  stop: {
    user: string;
    after: number;
  };
  end: {};
}

class EventDischarger<E> {
  emit<Event extends keyof E>(eventName: Event, payload: E[Event]) {
    // 省略
  }
}

// 使用例
const ed = new EventDischarger<EventPayloads>();
ed.emit("start", {
  user: "user1"
});
ed.emit("stop", {
  user: "user1",
  after: 3
});
ed.emit("end", {});

// エラー例
ed.emit("start", {
  user: "user2",
  after: 0
});
ed.emit("stop", {
  user: "user2"
});
ed.emit("foobar", {
  foo: 123
});

// ------------------------------------------------------

type Action = {type: 'increment', amount: number} | { type: 'decrement', amount: number} | { type: 'reset', value: number }

const reducer = (state: number, action: Action) => {
  switch (action.type) {
    case "increment":
      return state + action.amount;
    case "decrement":
      return state - action.amount;
    case "reset":
      return action.value;
  }
};

// 使用例
reducer(100, {
    type: 'increment',
    amount: 10,
}) === 110;
reducer(100, {
    type: 'decrement',
    amount: 55,
}) === 45;
reducer(500, {
    type: 'reset',
    value: 0,
}) === 0;

// エラー例
reducer(0,{
    type: 'increment',
    value: 100,
});

// ------------------------------------------------------

type Func<A, R> = (arg: A extends undefined ? void : A) => R;

// 使用例
const f1: Func<number, number> = num => num + 10;
const v1: number = f1(10);

const f2: Func<undefined, number> = () => 0;
const v2: number = f2();
const v3: number = f2(undefined);

const f3: Func<number | undefined, number> = num => (num || 0) + 10;
const v4: number = f3(123);
const v5: number = f3();

// エラー例
const v6: number = f1();