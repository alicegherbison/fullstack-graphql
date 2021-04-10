import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

import Loader from "../components/Loader";
import NewPetModal from "../components/NewPetModal";
import PetsList from "../components/PetsList";

const FETCH_ALL_PETS = gql`
  query FetchAllPets {
    pets {
      id
      name
      type
    }
  }
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const { data, loading, error } = useQuery(FETCH_ALL_PETS);

  const onSubmit = input => {
    setModal(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error</p>;
  }

  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />;
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>
          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data.pets} />
      </section>
    </div>
  );
}
