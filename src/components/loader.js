export default function Loader() {
    return (
        <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <span>Loading...</span>
        </div>
    )
}