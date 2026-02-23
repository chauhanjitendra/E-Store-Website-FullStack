const { useState, useLayoutEffect } = require("react")

const useWindowSize = ()=>{
    const [size, setSize] = useState({Width: null, height: null})

    useLayoutEffect(()=>{
        const handleSize = ()=>{
            setSize({
                Width: window.innerWidth,
                height: window.innerHeight
            })
        }

        handleSize()
        window.addEventListener('resize',handleSize)

        return()=>{
            window.removeEventListener('resize',handleSize)
        }
    },[])

    return size
}
export default useWindowSize