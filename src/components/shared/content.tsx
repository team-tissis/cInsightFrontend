import { ReactNode } from 'react'
import { Flex } from './flex'

type ContentHeaderProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    headerTitle?: string | ReactNode
    left?: ReactNode
    right?: ReactNode
}

export const ContentHeader = (props: ContentHeaderProps): JSX.Element => {
    const { headerTitle, left, right, ...rest } = props
    return (
        <Flex alignItems="center" justifyContent="space-between" {...rest}>
            <Flex alignItems="center">
                {props.headerTitle && <div style={{ fontSize: 28 }}>{props.headerTitle}</div>}
                {props.left}
            </Flex>
            <Flex alignItems="center">{props.right}</Flex>
        </Flex>
    )
}

type ContentBodyProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    children: ReactNode
}

export const ContentBody = (props: ContentBodyProps): JSX.Element => {
    return (
        <div style={{ margin: '10px 0', overflowX: 'scroll', position: 'relative' }} {...props}>
            {props.children}
        </div>
    )
}
