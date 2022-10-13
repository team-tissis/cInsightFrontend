import React, { ReactNode } from 'react'
import { CSSProperties } from 'styled-components'

type AlignItems = 'center' | 'end' | 'flex-end' | 'flex-start' | 'start' | 'stretch'
type JustifyContent = AlignItems | 'space-around' | 'space-between' | 'space-evenly'
type FlexDirection = 'column' | 'column-reverse' | 'row' | 'row-reverse'
type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse'

type FlexProps = React.HTMLAttributes<HTMLDivElement> & {
    justifyContent?: JustifyContent
    alignItems?: AlignItems
    flexDirection?: FlexDirection
    childMargin?: 5 | 10 | 15
    flexWrap?: FlexWrap
    children?: ReactNode
    style?: CSSProperties
}

export const Flex: React.FC<FlexProps> = (props: FlexProps) => {
    const { justifyContent, alignItems, flexDirection, childMargin, flexWrap, children, style, ...rest } = props

    return (
        <>
            <div
                className={`flexbox ${childMargin ? `child-margin-${flexDirection?.slice(0, 1)}-${childMargin}` : ''}`}
                style={{
                    display: 'flex',
                    justifyContent: justifyContent,
                    alignItems: alignItems,
                    flexDirection: flexDirection,
                    flexWrap: flexWrap,
                    ...style,
                }}
                {...rest}
            >
                {children}
            </div>
        </>
    )
}

Flex.defaultProps = {
    justifyContent: 'start',
    alignItems: 'start',
    flexDirection: 'row',
    childMargin: 10,
}
