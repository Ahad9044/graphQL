import { gql } from "@apollo/client";
import { useQuery} from "@apollo/client/react";


const query = gql`
query {
  getTodos {
    title
    user {
      email
      name
      zipcode
    }
  }
}
  `

function App() {
const {data , loading , error} = useQuery(query)
if(loading) return <h1>Loading</h1>
  if (error) return <h2>Error: {error.message}</h2>;
 return (
    <div style={{ padding: "20px" }}>
      <h1>Todos</h1>

      {data.getTodos.map((todo, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
            background: "#f5f5f5"
          }}
        >
          <h3>{todo.title}</h3>

          <p>
            <strong>Name:</strong> {todo.user.name}
          </p>
          <p>
            <strong>Email:</strong> {todo.user.email}
          </p>
          <p>
            <strong>Zipcode:</strong> {todo.user.zipcode}
          </p>
        </div>
      ))}
    </div>
  );
}
export default App;
