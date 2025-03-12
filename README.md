# MetaMorph UI

MetaMorph UIは、Solid.jsのためのモダンなUIコンポーネントライブラリです。アニメーションとインタラクティブな要素を重視し、美しいユーザーインターフェースを簡単に構築できます。

## インストール

```bash
npm install @oumugai/metamorph-ui solid-js
# または
yarn add @oumugai/metamorph-ui solid-js
# または
pnpm add @oumugai/metamorph-ui solid-js
```

## セットアップ

1. CSSのインポート：
```typescript
import 'metamorph-ui/styles';
```

2. コンポーネントのインポート：
```typescript
import { Card, Input, Button } from 'metamorph-ui';
```

## コンポーネント

### Card

インタラクティブな3D効果を持つカードコンポーネント。

```typescript
import { Card } from 'metamorph-ui';

// 基本的な使用法
<Card>
  コンテンツをここに配置
</Card>

// インタラクティブな3D効果付き
<Card interactive tilt>
  マウスホバーで3D効果が表示されます
</Card>

// 異なるバリアント
<Card variant="elevated">Elevated Card</Card>
<Card variant="outlined">Outlined Card</Card>
<Card variant="filled">Filled Card</Card>
```

#### プロパティ

| プロパティ名 | 型 | デフォルト | 説明 |
|------------|-----|---------|------|
| variant | 'elevated' \| 'outlined' \| 'filled' | 'elevated' | カードのスタイルバリアント |
| interactive | boolean | false | マウスインタラクションの有効化 |
| tilt | boolean | true | 3D傾き効果の有効化 |
| class | string | - | 追加のCSSクラス |
| style | object | - | インラインスタイル |

### Input

高度にカスタマイズ可能なインプットコンポーネント。

```typescript
import { Input } from 'metamorph-ui';

// 基本的な使用法
<Input 
  label="ユーザー名"
  placeholder="ユーザー名を入力"
/>

// エラー表示
<Input 
  label="メールアドレス"
  error="有効なメールアドレスを入力してください"
/>

// ヘルパーテキスト付き
<Input
  label="パスワード"
  type="password"
  helperText="8文字以上の英数字を入力してください"
/>

// サイズバリエーション
<Input size="sm" placeholder="Small input" />
<Input size="md" placeholder="Medium input" />
<Input size="lg" placeholder="Large input" />
```

#### プロパティ

| プロパティ名 | 型 | デフォルト | 説明 |
|------------|-----|---------|------|
| label | string | - | 入力フィールドのラベル |
| placeholder | string | - | プレースホルダーテキスト |
| type | string | 'text' | 入力タイプ（text, password, etc） |
| value | string | - | 入力値 |
| error | string | - | エラーメッセージ |
| helperText | string | - | ヘルプテキスト |
| disabled | boolean | false | 無効状態 |
| size | 'sm' \| 'md' \| 'lg' | 'md' | インプットのサイズ |
| icon | JSX.Element | - | 先頭に表示するアイコン |

### Chart

データビジュアライゼーションのためのチャートコンポーネント。

```typescript
import { Chart } from 'metamorph-ui';

<Chart
  data={[
    { label: 'A', value: 10 },
    { label: 'B', value: 20 },
    { label: 'C', value: 15 }
  ]}
/>
```

### CircularProgress

ローディング状態を表示するための円形プログレスインジケータ。

```typescript
import { CircularProgress } from 'metamorph-ui';

// 不定のプログレス
<CircularProgress />

// 進捗率付き
<CircularProgress value={75} />
```

### LineChart

時系列データなどを表示するための折れ線グラフコンポーネント。

```typescript
import { LineChart } from 'metamorph-ui';

<LineChart
  data={[
    { x: '2024-01', y: 30 },
    { x: '2024-02', y: 45 },
    { x: '2024-03', y: 55 }
  ]}
/>
```

## アニメーションとインタラクション

MetaMorph UIのコンポーネントは、洗練されたアニメーションとインタラクションを内蔵しています：

- Cardコンポーネントの3D傾き効果
- Inputフィールドのホバーとフォーカス時の浮き上がり効果
- スムーズなトランジションとフィードバック

## ライセンス

MIT License
