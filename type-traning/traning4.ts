// see https://qiita.com/uhyo/items/e4f54ef3b87afdd65546#%E9%9B%A3%E6%98%93%E5%BA%A6%E5%88%9D%E5%BF%83%E8%80%85%E5%8D%92%E6%A5%AD%E3%83%AC%E3%83%99%E3%83%AB

// ------------------------------------------------------

function getFoo<T extends object>(obj: T): T extends {foo: infer E} ? E :unknown {
  return (obj as any).foo;
}

// 使用例
// numはnumber型
const num = getFoo({
  foo: 123
});
// strはstring型
const str = getFoo({
  foo: "hoge",
  bar: 0
});
// unkはunknown型
const unk = getFoo({
  hoge: true
});

// エラー例
getFoo(123);
getFoo(null);

// ------------------------------------------------------

function giveId<T>(obj: T): Omit<T, 'id'> & { id: string } {
  const id = "本当はランダムがいいけどここではただの文字列";
  return {
    ...obj,
    id
  };
}

// 使用例
/*
 * obj1の型は { foo: number; id: string } 型
 */
const obj1 = giveId({ foo: 123 });
obj1.id;
/*
 * obj2の型は { num : number; id: string } 型
 */
const obj2 = giveId({
  num: 0,
  id: 100,
});
obj.id;
// obj2のidはstring型なので別の文字列を代入できる
obj2.id = '';

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

type Spread<Ev, EvOrig, E> = Ev extends keyof E ? EvOrig[] extends Ev[] ? E[Ev] : never : never;

class EventDischargerA<E> {
  emit<Ev extends keyof E>(eventName: Ev, payload: Spread<Ev, Ev, E>) {
    // 省略
  }
}

// 使用例
const ed1 = new EventDischargerA<EventPayloads>();
ed1.emit("start", {
  user: "user1"
});
ed1.emit("stop", {
  user: "user1",
  after: 3
});
ed1.emit("end", {});

// エラー例
ed1.emit<"start" | "stop">("stop", {
  user: "user1"
});

// ------------------------------------------------------

type PartiallyPartial<T, K extends keyof T> = Partial<{[k in keyof Pick<T, K>]: T[k]}> & Omit<T, K>

// 使用例

// 元のデータ
interface Data {
  foo: number;
  bar: string;
  baz: string;
}
/*
 * T1は { foo?: number; bar?: string; baz: string } 型
 */
type TT = PartiallyPartial<Data, "foo" | "bar">;
const a: TT = { baz: 'aaa' }


// ------------------------------------------------------

type Spread2<T, K extends keyof T> = K extends keyof T ? PartiallyPartial<T, Exclude<keyof T, K>>: never;
type AtLeastOne<T> = Spread2<T, keyof T>;

// 使用例
interface Options {
  foo: number;
  bar: string;
  baz: boolean;
}
function test(options: AtLeastOne<Options>) {
  const { foo, bar, baz } = options;
  // 省略
}
test({
  foo: 123,
  bar: "bar"
});
test({
  baz: true
});

// エラー例
test({});

// ------------------------------------------------------

type Page =
  | {
      page: "top";
    }
  | {
      page: "mypage";
      userName: string;
    }
  | {
      page: "ranking";
      articles: string[];
    };

type PageGenerators = {[k in Page['page']]: (args: Extract<Page, {page: k}>) => void}

const pageGenerators: PageGenerators = {
  top: () => "<p>top page</p>",
  mypage: ({ userName }) => `<p>Hello, ${userName}!</p>`,
  ranking: ({ articles }) =>
    `<h1>ranking</h1>
         <ul>
        ${articles.map(name => `<li>${name}</li>`).join("")}</ul>`
};
const renderPage = (page: Page) => pageGenerators[page.page](page as any);

// ------------------------------------------------------

type KeysOfType<Obj, Val> = {
  [K in keyof Obj]-?: Obj[K] extends Val ? K : never
}[keyof Obj];

// 使用例
type DataS = {
  foo: string;
  bar: number;
  baz: boolean;

  hoge?: string;
  fuga: string;
  piyo?: number;
};

// "foo" | "fuga"
// ※ "hoge" は string | undefiendなので含まない
type StringKeys = KeysOfType<DataS, string>;

function useNumber<Obj>(obj: Obj, key: KeysOfType<Obj, number>) {
  // ヒント: ここはanyを使わざるを得ない
  const num: number = (obj as any)[key];
  return num * 10;
}

declare const data2: DataS;

// これはOK
useNumber(data2, "bar");
// これは型エラー
useNumber(data2, "baz");

// ------------------------------------------------------
type PickUndefined<Obj> = {
  [K in keyof Obj]-?: undefined extends Obj[K] ? K : never
}[keyof Obj];

type MapToNever<Obj> = {
  [K in keyof Obj] : never
}

type OptionalKeys<Obj> = PickUndefined<MapToNever<Obj>>

// 使用例
type Data3 = {
  foo: string;
  bar?: number;
  baz?: boolean;

  hoge: undefined;
  piyo?: undefined;
};

// "bar" | "baz" | "piyo"
type T = OptionalKeys<Data3>;