import Logo from 'components/../../public/logo_h.png'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { Flex } from './flex'

export const Error404Page = (): JSX.Element => {
    return (
        <Flex flexDirection="column" alignItems="center" style={{ height: '80vh' }} justifyContent="center">
            <img src={Logo} style={{ maxWidth: 500, marginBottom: 30 }} />
            <div style={{ fontSize: 28, fontWeight: 'bold' }}>Error 404</div>
            <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 30 }}>ページが存在しません</div>
        </Flex>
    )
}

export default withRouter(Error404Page)
