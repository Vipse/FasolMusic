import React from 'react';
import { storiesOf } from '@storybook/react';
import StudentProfile from '../';

storiesOf('StudentProfile', module)
    .add('StudentProfile', () => (
        <div>
            <StudentProfile
                status={true}
            	name= "тестовый пациент"
            	img="https://24smi.org/public/media/resize/660x-/person/2017/10/25/cdRRFH0JWoYv_supermen.jpg"
            	lastDate={1523610900}
            	speciality={['Медик',"Доктор"]}
            	doctor="Тимошенко Т.И"
            	birthday={631271421}
            	age="18"
            	height="187"
				weight="85"
				isMy={true}
				id={2223}
				onAdd={(id) => {console.log(id)}}
            />
        </div>
    ))