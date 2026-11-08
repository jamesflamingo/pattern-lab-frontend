
import { useParams } from 'react-router-dom'

function PatternEditor() {
  const { id } = useParams()

  return (
    <main>
      <h1>Visual Editor</h1>
      <p>Editing garment: {id}</p>
    </main>
  )
}

export default PatternEditor

