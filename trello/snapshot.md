# snapshotテスト仕様

# syntax
snapshot(tree, 'snapshot test')
スナップショットが使われているファイルのコピーを作成し、その中身を書き込む。
someTest.js
snapshot/someTest.snap
というように。  

testNameがない時に、どう「変化した」ことを検知するんだろう。
ファイル内に、以前と同じ、jsonがあるか探す？
もし、たまたま、同じjsonがあった場合は、テストの失敗を成功と捉えてしまう恐れがある。
jestは、testNameで、snapshotを識別していたようだ。

testを走らせる。
(新しいスナップショットは、テストを走らせた段階で書き込む。)
下
スナップショットが間違っていることがみつかる。

assertz updateSnapShotを走らせると、
snapshotがアップデートされる。

{
  "foo test": "777",
  "object test": "{foo: "foo"}"
}
