  status: (val) => {
        return {
          [`${this.columnMapping.status}`]: {
            [Op.like]: `%${val}%`,
          },
        };
      },