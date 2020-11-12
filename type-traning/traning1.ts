// see https://qiita.com/uhyo/items/e4f54ef3b87afdd65546

// ---

function isPositive(num: number): boolean {
  return num >= 0;
}

// 使用例
isPositive(3);

// エラー例
isPositive('123');
const numVar: number = isPositive(-5);

// ---------

type User = {
  name: string,
  age: number,
  private: boolean,
}

function showUserInfo(user: User) {
  // 省略
}

// 使用例
showUserInfo({
  name: 'John Smith',
  age: 16,
  private: false,
});

// エラー例
showUserInfo({
  name: 'Mary Sue',
  private: false,
});
const usr: User = {
  name: 'Gombe Nanashino',
  age: 100,
};

// ---
type IsPositiveFunc = (num: number) => boolean;
const isPositive2: IsPositiveFunc = num => num >= 0;

// 使用例
isPositive2(5);

// エラー例
isPositive2('foo');
const res: number = isPositive(123);