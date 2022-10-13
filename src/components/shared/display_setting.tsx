import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { CookieManager } from 'utils/cookie_manager'
import { useEffectSkipFirst } from 'utils/hooks'
import { Flex } from './flex'
import { OrderTableCell, OrderTableCellProps, TableCell } from './widget'

export type ColumnInfo = OrderTableCellProps & {
    name: string
}

export type ColumnInfoList = {
    tableName: string
    values: ColumnInfo[]
}

export type TableHeadsProps = {
    displaySetting: DisplaySetting
}

export type DisplaySetting = {
    columnInfoList: ColumnInfoList
    hiddenList: number[]
    toggleDisplay: (index: number) => void
    toggleAll: () => void
    isVisibleAll: () => boolean
    getColumnLength: () => number
}

export const useDisplaySetting = (
    columnInfoList: ColumnInfoList,
    pageName: string,
    defaultVisibility: 'default_visible' | 'default_hidden' = 'default_visible',
    fixedHiddenList?: number[],
    ignoreSave?: boolean
): DisplaySetting => {
    const getDefaultHiddenList = (): number[] => {
        const hiddenList = CookieManager.getDisplaySettings(pageName, columnInfoList.tableName)
        if (hiddenList) {
            if (fixedHiddenList) {
                return hiddenList.concat(fixedHiddenList)
            }
            return hiddenList
        } else {
            const list = defaultVisibility === 'default_hidden' ? columnInfoList.values.map((_: ColumnInfo, index: number) => index) : []
            if (fixedHiddenList) {
                return list.concat(fixedHiddenList)
            }
            return list
        }
    }

    const [hiddenList, setHiddenList] = useState<number[]>(getDefaultHiddenList())
    const toggleDisplay = (index: number) => {
        if (hiddenList.includes(index)) {
            const newList = hiddenList.filter((idx) => idx != index)
            setHiddenList(newList)
        } else {
            setHiddenList([...hiddenList, index])
        }
    }

    const isVisibleAll = (): boolean => {
        return hiddenList.length === 0
    }

    const toggleAll = () => {
        if (isVisibleAll()) {
            setHiddenList(columnInfoList.values.map((_: ColumnInfo, index: number) => index))
        } else {
            setHiddenList([])
        }
    }

    const getColumnLength = (): number => {
        return Math.max(columnInfoList.values.length - hiddenList.length, 0)
    }

    const displaySetting = {
        columnInfoList,
        hiddenList,
        toggleDisplay,
        isVisibleAll,
        toggleAll,
        getColumnLength,
    }

    useEffectSkipFirst(() => {
        if (!ignoreSave) {
            CookieManager.saveDisplaySettings(pageName, columnInfoList.tableName, hiddenList)
        }
    }, [hiddenList])

    return displaySetting
}

export const TableHeads = ({ displaySetting }: TableHeadsProps): JSX.Element => {
    return (
        <>
            {displaySetting.columnInfoList.values
                .filter((_: ColumnInfo, index: number) => {
                    return !displaySetting.hiddenList.includes(index)
                })
                .map((columnInfo: ColumnInfo) => {
                    const { name, form, orderAttr: order, ...rest } = columnInfo
                    if (form) {
                        return (
                            <OrderTableCell key={name} form={form} orderAttr={order} {...rest}>
                                <div style={{ fontSize: 10, textAlign: columnInfo.align }}>{displaySetting.columnInfoList.tableName}</div>
                                {name}
                            </OrderTableCell>
                        )
                    } else {
                        return (
                            <TableCell key={name} {...rest}>
                                <div style={{ fontSize: 10, textAlign: columnInfo.align }}>{displaySetting.columnInfoList.tableName}</div>
                                {name}
                            </TableCell>
                        )
                    }
                })}
        </>
    )
}

export type DisplaySettingModalProps = {
    displaySettings: DisplaySetting[]
}

export const DisplaySettingModal = (props: DisplaySettingModalProps): JSX.Element => {
    const [show, setShow] = useState(false)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    return (
        <>
            <Button variant="secondary" onClick={handleShow}>
                表示設定
            </Button>

            <Modal show={show} onHide={handleClose} size={props.displaySettings.length > 3 ? 'xl' : 'lg'}>
                <Modal.Header closeButton>
                    <Modal.Title>表示設定</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Flex justifyContent="space-around">
                        {props.displaySettings.map((displaySetting: DisplaySetting) => {
                            return (
                                <div key={displaySetting.columnInfoList.tableName}>
                                    <Form.Group controlId={`display-${displaySetting.columnInfoList.tableName}-all`}>
                                        <Form.Check
                                            style={{ fontWeight: 'bold' }}
                                            type="checkbox"
                                            label={displaySetting.columnInfoList.tableName}
                                            onChange={() => displaySetting.toggleAll()}
                                            checked={displaySetting.isVisibleAll()}
                                        />
                                    </Form.Group>
                                    {displaySetting.columnInfoList.values.map((columnInfo: ColumnInfo, index: number) => {
                                        return (
                                            <div key={`${columnInfo.name}-${index}`} style={{ marginLeft: 10 }}>
                                                <Form.Group controlId={`display-${displaySetting.columnInfoList.tableName}-${index}`}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        label={columnInfo.name}
                                                        onChange={() => displaySetting.toggleDisplay(index)}
                                                        checked={!displaySetting.hiddenList.includes(index)}
                                                    />
                                                </Form.Group>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </Flex>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
