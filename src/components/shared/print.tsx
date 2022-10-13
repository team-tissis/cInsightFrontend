import styled from 'styled-components'

// export const Paper = createGlobalStyle`
//  body{
//     margin:0;
//     background: ${props => (props.background ? props.background : '#e0e0e0')}
//   }
// `;

export const NoPrint = styled.div`
    @media print {
        display: none;
    }
`

export const Portrait = styled.div`
    @media print {
        @page {
            size: A4 portrait;
        }
    }
`

export const Landscape = styled.div`
    @media print {
        @page {
            size: A4 landscape;
        }
    }
`
const Sheet = styled.section`
    margin: 0;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    page-break-after: always;
    @media screen {
        background: white;
        box-shadow: 0 0.5mm 2mm rgba(0, 0, 0, 0.3);
        margin: 5mm;
    }
`

export const A5 = styled(Sheet)<{ padding: number; landscape: boolean }>`
    padding: ${(props) => `${props.padding}mm`};
    @media print {
        width: ${(props) => (props.landscape ? '210mm' : '148mm')};
        padding: ${(props) => `${props.padding}mm`};
        background-color: white;
    }
    @media screen {
        width: ${(props) => (props.landscape ? '210mm' : '148mm')};
        height: ${(props) => (props.landscape ? '147mm' : '209mm')};
    }
`

export const A4 = styled(Sheet)<{ padding: number; landscape: boolean }>`
    padding: ${(props) => `${props.padding}mm`};
    @media print {
        width: ${(props) => (props.landscape ? '296mm' : '209mm')};
        height: ${(props) => (props.landscape ? '209mm' : '296mm')};
        padding: ${(props) => `${props.padding}mm`};
        background-color: white;
    }
    @media screen {
        width: ${(props) => (props.landscape ? '297mm' : '210mm')};
        height: ${(props) => (props.landscape ? '209mm' : '296mm')};
    }
`

export const A3 = styled(Sheet)<{ padding: number; landscape: boolean }>`
    padding: ${(props) => `${props.padding}mm`};
    @media print {
        width: ${(props) => (props.landscape ? '420mm' : '297mm')};
        padding: ${(props) => `${props.padding}mm`};
        background-color: white;
    }
    @media screen {
        width: ${(props) => (props.landscape ? '420mm' : '297mm')};
        height: ${(props) => (props.landscape ? '296mm' : '419mm')};
    }
`
