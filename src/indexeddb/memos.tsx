import Dexie from "dexie";

// TypeScriptの型定義
export interface MemoRecord {
  datetime: string
  title: string
  text: string
}


// データベース名を指定してインスタンスを生成
const database = new Dexie('markdown-editor')
// バージョンと使用するテーブルとインデックスとなるデータ名を指定
database.version(1).stores({memos: '&datetime'})
// データを扱うテーブルクラスを型を定義して取得
const memos: Dexie.Table<MemoRecord, string> = database.table('memos')

// テーブルへ保存する
export const putMemo = async (title: string, text: string): Promise<void> => {
  const datetime = new Date().toISOString()
  await memos.put({ datetime, title, text})
}

const NUM_PER_PAGE: number = 10

export const getMemoPageCount = async (): Promise<number> => {
  const totalCount = await memos.count()
  const pageCount = Math.ceil(totalCount / NUM_PER_PAGE)
  return pageCount > 0 ? pageCount : 1
}

export const getMemos = (page: number): Promise<MemoRecord[]> => {
  const offset = (page -1) * NUM_PER_PAGE
  return memos.orderBy('datetime')
              .reverse()
              .offset(offset)
              .limit(NUM_PER_PAGE)
              .toArray()
}
