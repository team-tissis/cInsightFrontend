import { useRef, useEffect, EffectCallback, DependencyList } from 'react'

/**
 * 初回ロード時は処理せず、2回目以降処理するEffect.
 * 初回以外は通常のuseEffectと同様に動作する.
 *
 * @param callback 初回以降のEffectで実行する処理.
 * @param effect Dependency list.
 */
export function useEffectSkipFirst(callback: EffectCallback, effect?: DependencyList): void {
    const isFirstRender = useRef(true)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
        } else {
            callback()
        }
    }, effect)
}

import { useState, Dispatch, SetStateAction } from 'react'
import { useLocation } from 'react-router-dom'

export type ParseableValue = string | number | boolean | null | undefined | Record<string, unknown> | Array<unknown> | File

export type FormAttrType<T> = keyof T | Array<string | number>

export type Form<T> = {
    object: T
    modelName?: string
    set: Dispatch<SetStateAction<T>>
    update: (setter: (f: T) => void) => void
    updateObject: (attr: FormAttrType<T>, value: ParseableValue) => void
    getValue: (attr: FormAttrType<T>) => ParseableValue
    resetForm: () => void
}

export function isForm<T>(arg: any): arg is Form<T> {
    return arg.object !== undefined && arg.modelName !== undefined && arg.getValue !== undefined && arg.resetForm !== undefined
}

/**
 * Formオブジェクトに値を設定するhooks.
 * ジェネリクスでフォームのtypeを指定する.
 *
 * @param initialForm 初期値.
 * @param modelName
 */
export function useForm<T>(initialForm: T, modelName?: string): Form<T> {
    const [form, setForm] = useState<T>(initialForm)

    const resetForm = () => {
        setForm(() => initialForm)
    }

    const copyForm = (): T => {
        if (form instanceof Array) {
            return Object.assign([], form)
        } else {
            return Object.assign({}, form)
        }
    }

    /**
     * マニュアルでattributeを更新する
     * @param setter 設定するメソッド
     */
    const updateForm = (setter: (f: T) => void): void => {
        const copledForm: T = copyForm()
        setter(copledForm)
        setForm(() => copledForm)
    }

    const updateObject = (attr: FormAttrType<T>, value: ParseableValue): void => {
        const copledForm: T = copyForm()
        if (copledForm instanceof Object) {
            if (attr instanceof Array) {
                let selectObj = copledForm as { [key: string]: any }
                attr.map((a, index) => {
                    if (index + 1 == attr.length) {
                        selectObj[a] = value === '' ? null : value
                    } else {
                        // if (typeof a === 'number' && !selectObj) {
                        //     selectObj = []
                        // }
                        if (selectObj instanceof Array && selectObj[a as number] === undefined) {
                            selectObj[a as number] = {}
                        }
                        selectObj = selectObj[a] as { [key: string]: any }
                    }
                })
            } else {
                const selectObj = copledForm as { [key: string]: any }
                selectObj[attr as string] = value === '' ? null : value
            }
        } else {
            throw 'updateArray method require form type object'
        }

        setForm(() => copledForm!)
    }

    const getObjectValue = (attr: FormAttrType<T>): ParseableValue => {
        let returnValue = null
        try {
            if (form instanceof Object) {
                if (attr instanceof Array) {
                    let selectObj = form as { [key: string]: any }
                    attr.map((a, index) => {
                        if (index + 1 == attr.length) {
                            returnValue = selectObj[a]
                        } else {
                            selectObj = selectObj[a] as { [key: string]: any }
                        }
                    })
                } else {
                    const selectObj = form as { [key: string]: any }
                    returnValue = selectObj[attr as string]
                }
            } else {
                throw 'updateArray method require form type object'
            }
        } catch {
            return null
        }
        return returnValue
    }

    const getValue = (attr: FormAttrType<T>): ParseableValue => {
        return getObjectValue(attr)
    }

    return {
        object: form,
        modelName: modelName,
        set: setForm,
        update: updateForm,
        updateObject: updateObject,
        getValue: getValue,
        resetForm: resetForm,
    }
}

export const useNestedForm = <T, U>(form: Form<T>, modelName: string): Form<U> => {
    const [obj, setObj] = useState<U>(form.getValue(modelName as FormAttrType<T>) as U)

    useEffect(() => {
        form.updateObject(modelName as FormAttrType<T>, { ...obj } as ParseableValue)
    }, [obj])

    const updateObject = (attr: FormAttrType<U>, value: ParseableValue) => {
        if (typeof attr == 'string') {
            form.updateObject([modelName, attr], value)
        } else {
            form.updateObject([modelName, ...(attr as Array<string | number>)], value)
        }
    }

    const getValue = (attr: FormAttrType<U>): ParseableValue => {
        if (typeof attr == 'string') {
            return form.getValue([modelName, attr])
        } else {
            return form.getValue([modelName, ...(attr as Array<string | number>)])
        }
    }

    const getObject = (): U => {
        const object = form.getValue(modelName as FormAttrType<T>)
        return object as U
    }

    /**
     * マニュアルでattributeを更新する
     * @param setter 設定するメソッド
     */
    const updateForm = (setter: (f: U) => void): void => {
        const copledForm: U = { ...(form.getValue(modelName as FormAttrType<T>) as U) }
        setter(copledForm)
        form.updateObject(modelName as FormAttrType<T>, copledForm as Record<string, unknown>)
    }

    return {
        object: getObject(),
        modelName: modelName,
        updateObject: updateObject,
        getValue: getValue,
        update: updateForm,
        set: setObj,
        resetForm: form.resetForm,
    }
}

export const convertRansackQueryParams = <T>(searchForm: Form<T>): { q: T } => {
    return { q: searchForm.object }
}

export const useQuery = <T>(): T => {
    const obj: any = {}
    const params = new URLSearchParams(useLocation().search)
    for (const [key, value] of params.entries()) {
        obj[key] = value
    }
    return obj as T
}

export const usePrevious = <T>(value: T) => {
    const ref = useRef(value)
    useEffect(() => {
        ref.current = value
    })
    return ref.current
}
