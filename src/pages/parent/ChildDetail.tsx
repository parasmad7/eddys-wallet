import { useParams } from 'react-router-dom';
import { PagePlaceholder } from '../PagePlaceholder';

export function ChildDetail() {
  const { id } = useParams();
  return <PagePlaceholder name={`Child Detail - ${id}`} />;
}
