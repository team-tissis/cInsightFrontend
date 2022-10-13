import { useEffect, useState } from 'react'
import { ReactNode } from 'react'
import { useRef } from 'react'
import { CSSProperties } from 'react'

type DoubleScrollbarProps = {
    topScrollStyle?: CSSProperties
    wrapperStyle?: CSSProperties
    children: ReactNode
}

const DoubleScrollbar = (props: DoubleScrollbarProps) => {
    const outerDiv = useRef<HTMLDivElement>(null)
    const childWrapper = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState<number | string>(0)

    useEffect(() => {
        // Set initial width
        calculateWidth()

        // Update width when window size changes
        window.addEventListener('resize', calculateWidth)

        // assoc the scrolls
        if (outerDiv.current) {
            outerDiv.current.onscroll = () => {
                childWrapper.current!.scrollLeft = outerDiv.current!.scrollLeft
            }
        }
        if (childWrapper.current) {
            childWrapper.current.onscroll = () => {
                outerDiv.current!.scrollLeft = childWrapper.current!.scrollLeft
            }
        }
        return () => {
            window.removeEventListener('resize', calculateWidth)
        }
    }, [])

    useEffect(() => {
        calculateWidth()
    })

    const calculateWidth = () => {
        let w = getChildWrapperWidth()

        if (w == null) {
            w = 'auto'
        }

        // Set the width of the inner div to the first child's
        if (w !== width) {
            setWidth(w)
        }
    }

    const getChildWrapperWidth = () => {
        let width = null
        if (childWrapper?.current && childWrapper.current.scrollWidth) {
            width = childWrapper.current.scrollWidth + 'px'
        }
        return width
    }

    return (
        <div>
            <div ref={outerDiv} style={{ overflowX: 'auto', overflowY: 'hidden', position: 'sticky', top: -20, ...props.topScrollStyle }}>
                <div style={{ paddingTop: '1px', width: width, height: 1 }}>&nbsp;</div>
            </div>
            <div ref={childWrapper} style={{ overflow: 'auto', overflowY: 'hidden', ...props.wrapperStyle }}>
                {props.children}
            </div>
        </div>
    )
}

export default DoubleScrollbar
