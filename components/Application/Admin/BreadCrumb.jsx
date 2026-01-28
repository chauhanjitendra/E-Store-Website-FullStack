import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const   BreadCrumb = ({breadcrumbData}) => {
  return (
    <div>
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          {breadcrumbData.length > 0 && breadcrumbData.map((data,index)=>{
            return(
                index !== breadcrumbData.length - 1
                ?
                <div key={index} className="flex items-center">
                    <BreadcrumbItem>
                        <BreadcrumbLink href={data.href}>{data.Label}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className='ms-2 mt-1'/>
                </div>
                :
                <div key={index} className="flex items-center">
                    <BreadcrumbItem>
                        <BreadcrumbLink href={data.href} className='font-semibold'>{data.Label}</BreadcrumbLink>
                    </BreadcrumbItem>
                </div>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
