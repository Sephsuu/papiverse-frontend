export function handleChange(e, setItem) {
    const { name, value } = e.target;
    setItem(prev => ({
        ...prev,
        [name]: value
    }))
}