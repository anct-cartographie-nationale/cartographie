type DescriptionProps = {
  description: string;
};

export const Description = ({ description }: DescriptionProps) => (
  <>
    <h2 className='text-xl text-base-title font-bold mb-4'>Description du lieu</h2>
    <p>{description}</p>
  </>
);
