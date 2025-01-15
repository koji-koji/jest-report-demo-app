このプロジェクトは、GitHub でのテスト観点のレビュー効率化を目的としたサンプルアプリケーションです。

テストにおいて、テストコードの品質だけではなく、テスト観点が網羅できているかが重要です。
しかし、テストケースが多くなると、行数が多くなってしまうこともありテスト観点を網羅できているかが分かりづらくなってしまいます。

そこで、Jest のカスタムレポートを活用してテストケース一覧を書き出すようにしました。
テストケース一覧を出力することで、レビューの際にテストケースを一覧でき、不足がないかチェックしやすくなります。

# 初期設定

## Voltaのインストール（未インストールの場合）

```
$ curl https://get.volta.sh | bash
$ export VOLTA_HOME="$HOME/.volta"
$ export PATH="$VOLTA_HOME/bin:$PATH"
$ source ~/.bashrc
$ volta --version
$ volta install
```

## 依存関係のインストール

```
$ npm install
```

# テストの実行とレポートの出力

```
$ npm run test:report
```

上記のコマンドを叩くと、/src/tests/testCaseTitles.md に各テストケースのテキストが出力されます。

例
```md
# Test Results


## File: add.spec.ts

add
  ✓ should add two numbers
  nest
    ✓ should add two numbers
    nest twice
      ✓ should add two numbers


## File: add2.spec.ts

add2
  ✓ should add two numbers

```

# 備考
- MyCustomReporter.ts を編集することで、各テストにどのぐらいの時間がかかっているかを出力することも可能です。
